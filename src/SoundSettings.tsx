import type {SoundPreferences} from './audio-design';

export function SoundSettings({value,onChange}:{value:SoundPreferences;onChange:(value:SoundPreferences)=>void}){return <fieldset className="sound-settings">
 <legend>Sound</legend>
 <label className="check"><input type="checkbox" checked={value.muted} onChange={e=>onChange({...value,muted:e.target.checked})}/><span>Mute all sound</span></label>
 {([['master','Overall volume'],['effects','Sound effects'],['ambience','Wind & leaves'],['music','Ambient music']] as const).map(([key,label])=><label key={key}>{label}<output>{Math.round(value[key]*100)}%</output><input aria-label={label} type="range" min="0" max="1" step=".05" value={value[key]} onChange={e=>onChange({...value,[key]:Number(e.target.value)})}/></label>)}
</fieldset>;}
