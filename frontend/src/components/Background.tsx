import DeepPurpleCircle from '../assets/Circle/DeepPurpleCircle.png';
import MintCircle from '../assets/Circle/MintCircle.svg';
import MintCircleSm from '../assets/Circle/MintCircleSm.svg';
import PurpleCircle from '../assets/Circle/PurpleCircle.svg';
import PurpleCircleSm from '../assets/Circle/PurpleCircleSm.png';
import PurpleTransCircle from '../assets/Circle/PurpleTransCircle.svg';
import FullNote1 from '../assets/MusicNote/FullNote1.svg';
import FullNote2 from '../assets/MusicNote/FullNote2.svg';
import FullNote3 from '../assets/MusicNote/FullNote3.svg';
import FullNote4 from '../assets/MusicNote/FullNote4.svg';
import FullNote5 from '../assets/MusicNote/FullNote5.svg';
import FullNote6 from '../assets/MusicNote/FullNote6.svg';
import FullNote7 from '../assets/MusicNote/FullNote7.svg';
import React, { ReactNode } from 'react';

interface BackgroundProps {
  children: ReactNode;
}

interface Coordinate {
  src: string;
  left?: string;
  right?: string;
  top: string;
}

export default function Background({ children }: BackgroundProps) {
  const coordinates: Coordinate[] = [
    { src: MintCircle, left: '20%', top: '80%' },
    { src: DeepPurpleCircle, left: '10%', top: '60%' },
    { src: MintCircleSm, left: '30%', top: '20%' },
    { src: PurpleCircle, left: '40%', top: '60%' },
    { src: PurpleCircleSm, left: '20%', top: '15%' },
    { src: PurpleTransCircle, left: '10%', top: '30%' },
  ];
  const notes: Coordinate[] = [
    { src: FullNote1, right: '90%', top: '70%' },
    { src: FullNote2, left: '10%', top: '80%' },
    { src: FullNote3, left: '90%', top: '70%' },
    { src: FullNote4, left: '25%', top: '90%' },
    { src: FullNote5, left: '80%', top: '15%' },
    { src: FullNote6, left: '10%', top: '30%' },
    { src: FullNote7, left: '2%', top: '40%' },
  ];
  return (
    <div className="relative h-full w-full">
      {coordinates.map((circle, index) => (
        <img
          key={index}
          src={circle.src}
          alt="원"
          style={{
            position: 'absolute',
            left: circle.left,
            top: circle.top,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {notes.map((note, index) => (
        <img
          key={index}
          src={note.src}
          alt="음표"
          style={{
            position: 'absolute',
            left: note.left,
            top: note.top,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {children}
    </div>
  );
}
