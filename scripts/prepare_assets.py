"""Copy only the scene's assets and their dependencies; preserve original sources."""
import json, shutil, hashlib
from PIL import Image
from pathlib import Path
from urllib.parse import unquote

root = Path(__file__).resolve().parents[1]
out = root / 'public' / 'assets'
out.mkdir(parents=True, exist_ok=True)
inventory = json.loads((root/'planning/asset_inventory.json').read_text())
selections = [
    ['Workbench','Anvil_Log','Shelf_Simple','Stool','Barrel','Crate_Wooden','Book_Stack_1','Lantern_Wall'],
    ['Floor_WoodDark','Wall_Plaster_Straight','Prop_Support','Roof_RoundTiles_6x6','Prop_WoodenFence_Single'],
    ['BirchTree_1','MapleTree_1','Bush_Small','Grass_Small'],
]
manifest = {'note':'Local prototype subset. Original CC0 licenses retained; hashes checked after copy. No game-dev CLI admission claimed.', 'files':[]}
models = {}
for i, (pack, names) in enumerate(zip(inventory['packs'], selections)):
    base = root/'asset-packs'/pack['pack']
    dest = out/f'pack{i}'
    def copy_file(src):
        rel = src.relative_to(base)
        target = dest/rel
        target.parent.mkdir(parents=True,exist_ok=True)
        shutil.copy2(src,target)
        digest=hashlib.sha256(src.read_bytes()).hexdigest()
        assert hashlib.sha256(target.read_bytes()).hexdigest()==digest
        manifest['files'].append({'source':str(src.relative_to(root)), 'output':str(target.relative_to(root)), 'sha256':digest})
    for name in names:
        entry = next((m for m in pack['gltf_models'] if m['name']==name),None)
        if not entry:
            print('MISSING',name); continue
        source = base/entry['path']
        doc = json.loads(source.read_text())
        copy_file(source)
        for resource in doc.get('buffers',[])+doc.get('images',[]):
            uri=resource.get('uri','')
            if uri and not uri.startswith('data:'):
                ref=(source.parent/unquote(uri)).resolve()
                assert ref.is_relative_to(base.resolve())
                copy_file(ref)
        models[name]='/assets/'+str((dest/source.relative_to(base)).relative_to(out)).replace('\\','/')
    for lic in pack['licenses']:
        copy_file(base/lic['path'])
traveler=root.parent/'kaykit_traveler_v02'
for name in ['Traveler_animated.glb','LICENSE_KayKit.txt','source_receipt.json']:
    shutil.copy2(traveler/name,out/name)
    manifest['files'].append({'source':str(traveler/name),'output':'public/assets/'+name,'sha256':hashlib.sha256((out/name).read_bytes()).hexdigest()})
models['Traveler']='/assets/Traveler_animated.glb'
for texture in out.rglob('*.png'):
    with Image.open(texture) as image:
        image.thumbnail((1024,1024),Image.Resampling.LANCZOS)
        image.save(texture,optimize=True)
for entry in manifest['files']:
    target=root/entry['output']
    entry['runtime_sha256']=hashlib.sha256(target.read_bytes()).hexdigest()
manifest['texture_processing']='Runtime PNGs limited to 1024px. Source textures unchanged.'
(root/'src').mkdir(exist_ok=True)
(root/'src/assets.json').write_text(json.dumps(models,indent=2))
(out/'receipt.json').write_text(json.dumps(manifest,indent=2))
print(json.dumps(models,indent=2))
print('Runtime asset bytes:',sum(p.stat().st_size for p in out.rglob('*') if p.is_file()))
