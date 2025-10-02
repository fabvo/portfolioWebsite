'use client';

import { useMemo, useState } from 'react';
import styles from './Prototype.module.css';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

type Card = {
  id: string;
  title: string;
  text: string;
};

const CARDS: Card[] = [
  { id: 'about',     title: 'Über mich',  text: 'Hi, ich bin Fabio ... (About-Text gekürzt)' },
  { id: 'projects',  title: 'Projekte',   text: 'Mini-Projekte ... (Itch.io usw.)' },
  { id: 'contact',   title: 'Kontakt',    text: 'Kontaktformular / Mail / LinkedIn ...' },
  { id: 'playground',title: 'Playground', text: 'Dev-Diary, Experimente, UI-Patterns ...' },
];

/** Droppable Zone Component */
function DropZone({
  isOver,
  setNodeRef,
}: {
  isOver: boolean;
  setNodeRef: (el: HTMLElement | null) => void;
}) {
  return (
    <div
      ref={setNodeRef}
      className={`${styles.dropZone} ${isOver ? styles.dropZoneOver : ''}`}
      aria-label="Karten-Bereich (ziehe eine Karte hierher)"
    >
      <p className={styles.dropHint}>
        {isOver ? 'Loslassen, um Karte abzulegen' : 'Ziehe eine Karte hierher'}
      </p>
    </div>
  );
}

/** Draggable Card Component (vollumfänglich ziehbar) */
function DraggableCard({
  card,
  idx,
  activeId,
}: {
  card: Card;
  idx: number;
  activeId: string | null;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
    data: { cardId: card.id },
  });

  // dnd-kit liefert eine "transform" (x/y), die wir mit unserer
  // bestehenden Rotation/Offset kombinieren:
  const dragTransform = CSS.Translate.toString(transform); // z.B. translate3d(x, y, 0)

  // Wichtig: Reihenfolge der Transforms:
  // 1) dnd-kit Drag-Translate (frei bewegen)
  // 2) unsere Y-Fächerung + raise
  // 3) unsere leichte Rotation fürs Fächern
  const style: React.CSSProperties = {
    zIndex: isDragging ? 999 : 10 + idx,
    // @ts-ignore CSS Variablen inline
    '--angle': `${(idx - (CARDS.length - 1) / 2) * 4}deg`,
    '--offset': `${Math.abs((CARDS.length - 1) / 2 - idx) * 2}px`,
    transform: `${dragTransform} translateY(calc(var(--offset, 0px) + var(--raise, 0px))) rotate(var(--angle, 0deg))`,
    touchAction: 'none', // bessere Touch-Drag-Unterstützung
  };

  return (
    <div
      ref={setNodeRef}
      className={`${styles.card} ${activeId === card.id ? styles.cardActive : ''}`}
      {...listeners}
      {...attributes}
      title={`Karte: ${card.title}`}
      style={style}
    >
      <span className={styles.cardTitle}>{card.title}</span>
    </div>
  );
}

export default function Prototype() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isOver, setIsOver] = useState(false);

  const cardById = useMemo(() => {
    const map = new Map<string, Card>();
    CARDS.forEach((c) => map.set(c.id, c));
    return map;
  }, []);

  // Drop-Zone via Hook
  const { setNodeRef } = useDroppable({ id: 'drop-zone' });

  const selectedCard = selectedId ? cardById.get(selectedId) : null;

  function handleDragOver(e: DragOverEvent) {
    setIsOver(e.over?.id === 'drop-zone');
  }

  function handleDragEnd(e: DragEndEvent) {
    const overId = e.over?.id;
    const activeId = e.active?.id as string | undefined;
    setIsOver(false);
    if (overId === 'drop-zone' && activeId) {
      setSelectedId(activeId); // Nur Drop in Zone zeigt den Text
    }
  }

  return (
    <DndContext onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className={styles.wrapper}>
        {/* Mittelbereich */}
        <section className={styles.middle}>
          <DropZone isOver={isOver} setNodeRef={setNodeRef} />

          <aside className={styles.infoPanel} aria-live="polite">
            {selectedCard ? (
              <>
                <h2 className={styles.infoTitle}>{selectedCard.title}</h2>
                <p
                  className={styles.infoText}
                  // dein aktueller Contact-Text enthält HTML-Zeilenumbrüche;
                  // wenn du das brauchst, könntest du dangerouslySetInnerHTML nutzen.
                >
                  {selectedCard.text}
                </p>
              </>
            ) : (
              <>
                <h2 className={styles.infoTitle}>Info</h2>
                <p className={styles.infoText}>
                  Noch keine Karte abgelegt. Ziehe unten eine Karte in den linken Bereich.
                </p>
              </>
            )}
          </aside>
        </section>

        {/* Karten-Hand (sticky/fixed) */}
        <section className={styles.hand} aria-label="Karten-Hand">
          {CARDS.map((card, idx) => (
            <DraggableCard key={card.id} card={card} idx={idx} activeId={selectedId} />
          ))}
        </section>
      </div>
    </DndContext>
  );
}