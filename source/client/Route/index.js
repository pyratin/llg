import { Application } from '@pixi/react';

import BunnySprite from './Component/BunnySprite';

const Route = () => {
  return (
    <div className='Route'>
      <Application>
        <BunnySprite />
      </Application>
    </div>
  );
};

export default Route;
