export const GATE_NOTICE_DURATION_MS=3200;

export function GateNotice(){return <aside className="gate-open-notice" role="status" style={{animationDuration:`${GATE_NOTICE_DURATION_MS}ms`}}>
 <span>✦ A new path awaits</span>
 <strong>The garden gate is open.</strong>
 <p>Head north, beyond the old tree, to explore the next chapter.</p>
</aside>;}
