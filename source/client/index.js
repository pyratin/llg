import { createRoot } from 'react-dom/client';
import { extend } from '@pixi/react';
import { Container, Graphics, Sprite } from 'pixi.js';

import Route from 'client/Route';
import 'client/style/index.scss';

createRoot(document.body).render(<Route />);

extend({ Container, Graphics, Sprite });
