import { useRef, useState, useEffect, useCallback } from 'react';
import { css } from '@emotion/react';

const Route = () => {
  const canvasDimension = 460;

  const fragmentDimension = 20;

  const delay = 120;

  const canvasRef = useRef(null);

  const [gameInitialized, gameInitializedSet] = useState(false);

  const [snakeCollection, snakeCollectionSet] = useState(null);

  const [snakeDirection, snakeDirectionSet] = useState(null);

  const [food, foodSet] = useState(null);

  const [gameScore, gameScoreSet] = useState(null);

  const onSnakeCollectionBoundaryCollisionHandle = useCallback(
    (snakeCollection) => {
      const _snakeCollection = [
        (() => {
          const x = snakeCollection[0][0];

          const y = snakeCollection[0][1];

          switch (true) {
            case x < 0:
              return [canvasDimension - fragmentDimension, y];

            case x > canvasDimension - fragmentDimension:
              return [0, y];

            case y < 0:
              return [x, canvasDimension - fragmentDimension];

            case y > canvasDimension - fragmentDimension:
              return [x, 0];

            default:
              return [x, y];
          }
        })(),
        ...snakeCollection.slice(1)
      ];

      snakeCollectionSet(_snakeCollection);

      return _snakeCollection;
    },
    []
  );

  const AABBCollisionGet = useCallback(
    ([x, y, width, height], [_x, _y, _width, _height]) => {
      return (
        x < _x + _width && _x < x + width && y < _y + _height && _y < y + height
      );
    },
    []
  );

  const onSnakeCollectionFoodCollisionHandle = useCallback(
    (snakeCollection, food, gameScore) => {
      const snakeRect = [
        ...snakeCollection[0],
        fragmentDimension,
        fragmentDimension
      ];

      const foodRect = [...food, fragmentDimension, fragmentDimension];

      const collision = AABBCollisionGet(snakeRect, foodRect);

      const _snakeCollection = collision
        ? snakeCollection
        : snakeCollection.slice(0, -1);

      const _food = collision ? foodInitializedGet(_snakeCollection) : food;

      const _gameScore = collision ? gameScore + 1 : gameScore;

      snakeCollectionSet(_snakeCollection);

      foodSet(_food);

      gameScoreSet(_gameScore);

      return [_snakeCollection, _food, _gameScore];
    },
    [AABBCollisionGet, foodInitializedGet]
  );

  const onSnakeCollectionCollisionHandle = useCallback(
    (snakeCollection, gameInitialized) => {
      const snakeRect = [
        ...snakeCollection[0],
        fragmentDimension,
        fragmentDimension
      ];

      const collision = snakeCollection
        .slice(1)
        .reduce((memo, _snakeCollection) => {
          if (memo) {
            return memo;
          }

          const _snakeRect = [
            ..._snakeCollection,
            fragmentDimension,
            fragmentDimension
          ];

          return AABBCollisionGet(snakeRect, _snakeRect);
        }, false);

      const _gameInitialized = collision ? false : gameInitialized;

      gameInitializedSet(_gameInitialized);

      return _gameInitialized;
    },
    [AABBCollisionGet]
  );

  const snakeUpdate = useCallback(
    (snakeCollection, [snakeDirectionX, snakeDirectionY]) => {
      const _snakeCollection = [
        (() => {
          const x = snakeCollection[0][0];

          const y = snakeCollection[0][1];

          return [
            x + snakeDirectionX * fragmentDimension,
            y + snakeDirectionY * fragmentDimension
          ];
        })(),
        ...snakeCollection
      ];

      snakeCollectionSet(_snakeCollection);

      return _snakeCollection;
    },
    []
  );

  const gameLoop = useCallback(() => {
    let _gameInitialized = gameInitialized;

    if (!_gameInitialized) {
      return null;
    }

    let _snakeCollection = snakeCollection;

    let _snakeDirection = snakeDirection;

    let _food = food;

    let _gameScore = gameScore;

    _snakeCollection =
      onSnakeCollectionBoundaryCollisionHandle(_snakeCollection);

    [_snakeCollection, _food, _gameScore] =
      onSnakeCollectionFoodCollisionHandle(_snakeCollection, _food, _gameScore);

    _gameInitialized = onSnakeCollectionCollisionHandle(
      _snakeCollection,
      _gameInitialized
    );

    if (!_gameInitialized) {
      return null;
    }

    _snakeCollection = snakeUpdate(_snakeCollection, _snakeDirection);

    return {
      _gameInitialized,
      _snakeCollection,
      _snakeDirection,
      _food
    };
  }, [
    gameInitialized,
    snakeCollection,
    snakeDirection,
    food,
    gameScore,
    onSnakeCollectionBoundaryCollisionHandle,
    onSnakeCollectionFoodCollisionHandle,
    onSnakeCollectionCollisionHandle,
    snakeUpdate
  ]);

  useEffect(() => {
    const timerId = setInterval(gameLoop, delay);

    return () => {
      return clearInterval(timerId);
    };
  }, [gameLoop]);

  const onDocumentKeydownHandle = useCallback(
    ({ keyCode }) => {
      if (!gameInitialized) {
        return null;
      }

      const snakeDirectionX = snakeDirection[0];

      const snakeDirectionY = snakeDirection[1];

      const [_snakeDirectionX, _snakeDirectionY] = (() => {
        switch (true) {
          case keyCode === 37:
            return [-1, 0];

          case keyCode === 38:
            return [0, -1];

          case keyCode === 39:
            return [1, 0];

          case keyCode === 40:
            return [0, 1];

          default:
            return [snakeDirectionX, snakeDirectionY];
        }
      })();

      if (
        _snakeDirectionX === snakeDirectionX ||
        _snakeDirectionY === snakeDirectionY
      ) {
        return null;
      }

      return snakeDirectionSet([_snakeDirectionX, _snakeDirectionY]);
    },
    [gameInitialized, snakeDirection]
  );

  useEffect(() => {
    document.addEventListener('keydown', onDocumentKeydownHandle);

    return () => {
      return document.removeEventListener('keydown', onDocumentKeydownHandle);
    };
  }, [onDocumentKeydownHandle]);

  const snakeCollectionInitialize = () => {
    const _snakeCollection = new Array(3).fill().map((_, index) => {
      return [
        (canvasDimension - fragmentDimension) / 2,
        (canvasDimension - fragmentDimension) / 2 + index * fragmentDimension
      ];
    });

    snakeCollectionSet(_snakeCollection);

    return _snakeCollection;
  };

  const snakeDirectionInitialize = () => {
    const _snakeDirection = [0, -1];

    return snakeDirectionSet(_snakeDirection);
  };

  const foodInitializedGetFn = useCallback(() => {
    return (
      Math.round(
        (Math.random() * (canvasDimension - fragmentDimension * 2) +
          fragmentDimension) /
          fragmentDimension
      ) * fragmentDimension
    );
  }, []);

  const foodInitializedGet = useCallback(
    (snakeCollection) => {
      const _food = [foodInitializedGetFn(), foodInitializedGetFn()];

      const foodRect = [..._food, fragmentDimension, fragmentDimension];

      const collision = snakeCollection.reduce((memo, _snakeCollection) => {
        if (memo) {
          return memo;
        }

        const snakeRect = [
          ..._snakeCollection,
          fragmentDimension,
          fragmentDimension
        ];

        return AABBCollisionGet(foodRect, snakeRect);
      }, false);

      return collision ? foodInitializedGet(snakeCollection) : _food;
    },
    [foodInitializedGetFn, AABBCollisionGet]
  );

  const foodInitialize = useCallback(
    (snakeCollection) => {
      const _food = foodInitializedGet(snakeCollection);

      foodSet(_food);

      return _food;
    },
    [foodInitializedGet]
  );

  const gameScoreInitialize = () => {
    return gameScoreSet(0);
  };

  const gameInitialize = () => {
    const _gameInitialized = true;

    return gameInitializedSet(_gameInitialized);
  };

  const onGameInitializeTriggerHandle = () => {
    const snakeCollection = snakeCollectionInitialize();

    snakeDirectionInitialize();

    foodInitialize(snakeCollection);

    gameScoreInitialize();

    gameInitialize();

    return null;
  };

  const fragmentRender = useCallback((x, y, width, height, color, context) => {
    context.beginPath();

    context.rect(x, y, width, height);

    context.closePath();

    context.fillStyle = color;

    context.fill();

    return null;
  }, []);

  const snakeFragmentRender = useCallback(
    (fragment, index, context) => {
      return fragmentRender(
        ...fragment,
        fragmentDimension,
        fragmentDimension,
        index ? 'green' : 'black',
        context
      );
    },
    [fragmentRender]
  );

  const snakeCollectionRender = useCallback(
    (context) => {
      return snakeCollection.map((fragment, index) => {
        return snakeFragmentRender(fragment, index, context);
      });
    },
    [snakeCollection, snakeFragmentRender]
  );

  const foodRender = useCallback(
    (context) => {
      return fragmentRender(
        ...food,
        fragmentDimension,
        fragmentDimension,
        'orange',
        context
      );
    },
    [fragmentRender, food]
  );

  const gameRender = useCallback(() => {
    if (!gameInitialized) {
      return null;
    }

    const context = canvasRef.current.getContext('2d');

    context.clearRect(0, 0, canvasDimension, canvasDimension);

    snakeCollectionRender(context);

    foodRender(context);
  }, [gameInitialized, snakeCollectionRender, foodRender]);

  useEffect(() => {
    gameRender();
  }, [gameRender]);

  const renderFn = () => {
    return (
      <div
        className={`
            d-flex
            justify-content-center
          `}
      >
        <canvas
          ref={canvasRef}
          className={`
              border
            `}
          width={canvasDimension}
          height={canvasDimension}
        />
      </div>
    );
  };

  const gameInitializeTriggerRender = () => {
    return (
      !gameInitialized && (
        <div
          className={`
            w-100
            h-100
            d-flex
            justify-content-center
          `}
          css={css({
            position: 'absolute',
            top: 0
          })}
        >
          <div
            className={`
              d-flex
              justify-content-center
              align-items-center
            `}
            css={css({
              width: canvasDimension,
              height: canvasDimension
            })}
          >
            <button
              className={`
                btn
                btn-success
              `}
              onClick={onGameInitializeTriggerHandle}
            >
              START
            </button>
          </div>
        </div>
      )
    );
  };

  const gameScoreRender = () => {
    return (
      (gameInitialized || typeof gameScore === 'number') && (
        <div
          className={`
            d-flex
            justify-content-center
          `}
        >
          <div
            className={`
              d-flex
              justify-content-end
            `}
            css={css({
              width: canvasDimension
            })}
          >
            <span>
              score : &nbsp;
              {gameScore}
            </span>
          </div>
        </div>
      )
    );
  };

  return (
    <div
      className={`
          Viewer
          mt-1
        `}
      css={css({
        position: 'relative'
      })}
    >
      {renderFn()}
      {gameInitializeTriggerRender()}
      {gameScoreRender()}
    </div>
  );
};

export default Route;
