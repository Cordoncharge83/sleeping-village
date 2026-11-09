import {useEffect, useRef, type PointerEvent} from 'react';
import type {TouchInput} from './touch-input';

type Contact = {id: number; x: number; y: number};

export function TouchControls({input}: {input: TouchInput}) {
  const stick = useRef<HTMLDivElement>(null);
  const moveContact = useRef<Contact | null>(null);
  const lookContact = useRef<Contact | null>(null);

  function centerStick() {
    moveContact.current = null;
    input.move(0, 0);
    stick.current?.style.removeProperty('--stick-x');
    stick.current?.style.removeProperty('--stick-y');
    stick.current?.removeAttribute('data-running');
  }

  useEffect(() => {
    function reset() {
      centerStick();
      lookContact.current = null;
      input.reset();
    }
    window.addEventListener('resize', reset);
    window.addEventListener('blur', reset);
    return () => {
      window.removeEventListener('resize', reset);
      window.removeEventListener('blur', reset);
      reset();
    };
  }, [input]);

  function moveStick(e: PointerEvent<HTMLDivElement>) {
    const contact = moveContact.current;
    if (contact?.id !== e.pointerId) return;
    const radius = e.currentTarget.clientWidth * 0.32;
    const x = (e.clientX - contact.x) / radius;
    const y = (e.clientY - contact.y) / radius;
    const scale = radius / Math.max(1, Math.hypot(x, y));
    input.move(x, y);
    e.currentTarget.style.setProperty('--stick-x', x * scale + 'px');
    e.currentTarget.style.setProperty('--stick-y', y * scale + 'px');
    e.currentTarget.toggleAttribute('data-running', input.running);
  }

  function startMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === 'mouse' || moveContact.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    moveContact.current = {id: e.pointerId, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2};
    e.currentTarget.setPointerCapture(e.pointerId);
    moveStick(e);
  }
  function endMove(e: PointerEvent<HTMLDivElement>) {
    if (moveContact.current?.id === e.pointerId) centerStick();
  }
  function startLook(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === 'mouse' || lookContact.current) return;
    lookContact.current = {id: e.pointerId, x: e.clientX, y: e.clientY};
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function moveLook(e: PointerEvent<HTMLDivElement>) {
    const contact = lookContact.current;
    if (contact?.id !== e.pointerId) return;
    input.lookX += e.clientX - contact.x;
    input.lookY += e.clientY - contact.y;
    contact.x = e.clientX;
    contact.y = e.clientY;
  }
  function endLook(e: PointerEvent<HTMLDivElement>) {
    if (lookContact.current?.id === e.pointerId) lookContact.current = null;
  }

  return <div className="touch-controls" role="group" aria-label="Touch controls">
    <div className="touch-look" onPointerDown={startLook} onPointerMove={moveLook}
      onPointerUp={endLook} onPointerCancel={endLook} onLostPointerCapture={endLook}>
      <span className="touch-caption">Swipe to look</span>
    </div>
    <div className="touch-stick" ref={stick} role="group" aria-label="Movement stick"
      onPointerDown={startMove} onPointerMove={moveStick}
      onPointerUp={endMove} onPointerCancel={endMove} onLostPointerCapture={endMove}>
      <span className="touch-knob" />
      <span className="touch-caption">Move</span>
    </div>
  </div>;
}
