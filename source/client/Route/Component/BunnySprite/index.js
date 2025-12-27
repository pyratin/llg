import { useState, useEffect } from 'react';
import { Texture, Assets } from 'pixi.js';

const BunnySprite = () => {
  const [texture, textureSet] = useState(Texture.EMPTY);

  const [active, activeSet] = useState(false);

  useEffect(() => {
    texture === Texture.EMPTY &&
      Assets.load('https://pixijs.com/assets/bunny.png').then(textureSet);
  }, [texture]);

  return (
    <pixiSprite
      texture={texture}
      anchor={0.5}
      x={100}
      y={100}
      scale={(active && 1.5) || 1}
      eventMode='static'
      onClick={() => activeSet(!active)}
    />
  );
};

export default BunnySprite;
