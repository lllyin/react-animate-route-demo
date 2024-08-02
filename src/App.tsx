import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import { useEffect, useRef } from 'react';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

import './App.scss';

const ANIMATION_MAP: any = {
  PUSH: 'forward',
  POP: 'back',
  SWIPE_BACK: 'swipe-back',
};

function App() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const isHorizontalSwipeRef = useRef<boolean>(false);
  const isSwipeBack = isHorizontalSwipeRef.current && navigationType === 'POP';
  const actionType = isSwipeBack ? 'SWIPE_BACK' : navigationType;

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      touchEndX.current = touch.clientX;
      touchEndY.current = touch.clientY;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      touchEndX.current = touch.clientX;
      touchEndY.current = touch.clientY;

      const deltaX = touchEndX.current - touchStartX.current;
      const deltaY = touchEndY.current - touchStartY.current;
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);

      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        console.log('touchend delta', deltaX, deltaY);
      }

      if (isHorizontalSwipe && Math.abs(deltaX) > 50) {
        console.log('Detected a swipe back gesture');
        isHorizontalSwipeRef.current = true;

        // 重置位置
        touchStartX.current = 0;
        touchStartY.current = 0;
        touchEndX.current = 0;
        touchEndY.current = 0;
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // 清理事件监听器
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  console.log('location', {
    actionType,
    navigationType,
    isHorizontalSwipe: isHorizontalSwipeRef.current,
    isSwipeBack,
    location,
  });

  return (
    <div className='App'>
      <TransitionGroup className={ANIMATION_MAP[actionType]}>
        <CSSTransition
          key={location.key}
          classNames={isSwipeBack ? '' : ANIMATION_MAP[actionType]}
          timeout={360}
        >
          <Routes location={location}>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
