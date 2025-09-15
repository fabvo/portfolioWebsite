'use client';

import { useState, useMemo } from 'react';
import styles from './Prototype.module.css';

type Card = {
  id: string;
  title: string;
  text: string;
};

const CARDS: Card[] = [
  {
    id: 'about',
    title: 'Über mich',
    text:
      'Hi, ich bin Fabio und das hier ist mein Portfolio Prototyp. Ich bin Game-Design orientierter Softwareentwickler. I Love storys and like creating some. I like to make things fun! If you want to know more about me: -backpacking -cinema, i love watching movies, especially on the silver screen  ',
  },
  {
    id: 'projects',
    title: 'Projekte',
    text:
      'mini-projekte: hier verlinkung für itch.io Projekte einbinden',
  },
  {
    id: 'contact',
    title: 'Kontakt',
    text:
      'Hier könnte ein Kontaktformular stehen    T_T         Hinterlasse gerne eine Nachricht! <br> fabio.voelkner@gmail.com    Linkedin Profil',
  },
  {
    id: 'playground',
    title: 'Playground',
    text:
      'Hier kommt alles hin, was noch keinen Platz hat: dev-diary, usw.',
  },
];

export default function Prototype() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isOver, setIsOver] = useState(false);

  const cardById = useMemo(() => {
    const map = new Map<string, Card>();
    CARDS.forEach((c) => map.set(c.id, c));
    return map;
  }, []);

  function onDragStart(e: React.DragEvent, cardId: string) {
    e.dataTransfer.setData('text/plain', cardId);
    e.dataTransfer.effectAllowed = 'move';
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();           
    e.dataTransfer.dropEffect = 'move';
    if (!isOver) setIsOver(true); 
  }

  function onDragLeave() {
    setIsOver(false);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const droppedId = e.dataTransfer.getData('text/plain');
    setIsOver(false);
    if (droppedId) setSelectedId(droppedId); 
  }

  const selectedCard = selectedId ? cardById.get(selectedId) : null;

  return (
    <div className={styles.wrapper}>
      <section className={styles.middle}>
        <div
          className={`${styles.dropZone} ${isOver ? styles.dropZoneOver : ''}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          aria-label="Karten-Bereich (ziehe eine Karte hierher)"
        >
          <p className={styles.dropHint}>
            {isOver ? 'Loslassen, um Karte abzulegen' : 'Ziehe eine Karte hierher'}
          </p>
        </div>

        <aside className={styles.infoPanel} aria-live="polite">
          {selectedCard ? (
            <>
              <h2 className={styles.infoTitle}>{selectedCard.title}</h2>
              <p className={styles.infoText}>{selectedCard.text}</p>
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

      <section className={styles.hand} aria-label="Karten-Hand">
        {CARDS.map((card, idx) => (
          <div
            key={card.id}
            className={`${styles.card} ${selectedId === card.id ? styles.cardActive : ''}`}
            draggable
            onDragStart={(e) => onDragStart(e, card.id)}
            title={`Karte: ${card.title}`}
            style={{
              transform: `translateY(${Math.abs((CARDS.length - 1) / 2 - idx) * 2}px) rotate(${(idx - (CARDS.length - 1) / 2) * 4}deg)`,
              zIndex: 10 + idx,
            }}
          >
            <span className={styles.cardTitle}>{card.title}</span>
          </div>
        ))}
      </section>
    </div>
  );
}