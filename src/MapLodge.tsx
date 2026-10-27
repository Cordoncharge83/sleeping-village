import {Box,Model,Sign,Table,Bench} from './SceneObjects';
import {mapLodgeLayout} from './village';

// A village cartographer’s diagram, deliberately separate from the product screenshot.
function StrategyMap(){return <group position={[0,2.15,-2.76]}>
 <Box p={[0,0,0]} s={[3.55,1.75,.1]} color="#70543b"/>
 <Box p={[0,0,.06]} s={[3.35,1.55,.025]} color="#d5c59e"/>
 {[-.85,0,.85].map((x,i)=><group key={x}>
  <Box p={[x,-.05,.085]} s={[.12,1.05,.012]} color="#a18d67"/>
  <Box p={[x,.42-i*.18,.095]} s={[.48,.32,.015]} color="#748675"/>
  <Box p={[x,-.45+i*.12,.095]} s={[.36,.23,.015]} color="#ad8263"/>
 </group>)}
 <Box p={[0,.08,.085]} s={[2.5,.09,.015]} color="#a18d67"/>
 {[-1,1].map(x=><mesh key={x} position={[x*.85,.08,.12]}><sphereGeometry args={[.07,8,6]}/><meshStandardMaterial color={x<0?'#486e72':'#a26348'}/></mesh>)}
 </group>;}
function Ledger(){return <group position={[0,1.15,-1.55]}>
 <Box p={[0,0,0]} s={[1.22,.065,.8]} color="#406766"/>
 {[-1,1].map(side=><group key={side}>
  <Box p={[side*.29,.045,0]} s={[.55,.03,.72]} color="#e4d3ac"/>
  {[0,1,2,3,4].map(i=><Box key={i} p={[side*.29,.064,-.23+i*.1]} s={[.4,.006,.018]} color="#a89370"/>)}
 </group>)}
 <Box p={[.12,.07,.31]} s={[.045,.009,.26]} color="#b58750"/>
 </group>;}
export function MapLodge(){const {desk,lab,archive,bench}=mapLodgeLayout;return <>
 <Box p={[0,.094,.7]} s={[1.45,.012,3.9]} color="#456663"/>
 {[-.66,.66].map(x=><Box key={x} p={[x,.102,.7]} s={[.025,.008,3.75]} color="#b9a272"/>)}
 <StrategyMap/>
 <Table position={[desk.p[0],.09,desk.p[2]]} scale={[desk.s[0],1,desk.s[2]]}/>
 <Ledger/>
 <Model name="Book_Stack_1" position={[.92,1.12,-1.9]} scale={.55}/>
 <Sign title="THE SCOUTING DESK" subtitle="Comp Atlas · Read theirs" position={[0,.75,-1.26]} width={1.9}/>
 <Table position={[lab.p[0],.09,lab.p[2]]} scale={[lab.s[0],1,lab.s[2]]}/>
 <Box p={[-1.95,1.125,.4]} s={[1.12,.02,1.68]} color="#d9cba7"/>
 {[0,1,2,3,4].map(i=><group key={i}>
  <Box p={[-2.21,1.14,-.18+i*.29]} s={[.28,.016,.22]} color="#718e82"/>
  <mesh position={[-2.21,1.2,-.18+i*.29]} castShadow><cylinderGeometry args={[.055,.08,.1,8]}/><meshStandardMaterial color={i<2?'#b38355':'#536f77'}/></mesh>
  <Box p={[-1.72,1.14,-.18+i*.29]} s={[.43,.012,.025]} color="#a18b66"/>
 </group>)}
 <Sign title="COMPOSITION LAB" subtitle="Build your game" position={[-1.95,.76,1.36]} width={1.2}/>
 <group position={[archive.p[0],.09,archive.p[2]]} rotation={[0,-Math.PI/2,0]}>
  <Box p={[0,.96,-.25]} s={[2,1.92,.08]} color="#594a36"/>
  {[-.94,.94].map(x=><Box key={x} p={[x,.96,0]} s={[.12,1.92,.6]} color="#806143"/>)}
  {[.08,.68,1.28,1.87].map(y=><Box key={y} p={[0,y,0]} s={[2,.1,.6]} color="#9b7952"/>)}
  {[.13,.73,1.33].flatMap((y,row)=>[-.7,-.35,0,.35,.7].map((x,i)=><group key={`${row}-${i}`}>
   <Box p={[x,y+.2,0]} s={[.24,.4,.39]} color={['#627d72','#9b7351','#a99670'][(row+i)%3]}/>
   <Box p={[x,y+.27,.2]} s={[.15,.055,.008]} color="#d4c39a"/>
  </group>))}
 </group>
 <Bench position={[bench.p[0],.09,bench.p[2]]} rotation={Math.PI/2} length={bench.s[2]}/>
 <Sign title="MATCH ARCHIVE" subtitle="Study · Compare · Prepare" position={[2.76,2.35,-.7]} rotation={-Math.PI/2} width={2}/>
 <Model name="Lantern_Wall" position={[-2.68,1.3,2.15]} scale={.45} rotation={Math.PI/2}/>
 <pointLight position={[-1.3,2,1]} color="#ffcb96" intensity={6} distance={5} decay={2}/>
 </>;}
