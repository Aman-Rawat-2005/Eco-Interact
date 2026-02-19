import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A utility component that scrolls the window to the top whenever the route changes.
 * It should be placed inside your React Router's <Router> component.
 */
function ScrollToTop() {
  // Extracts the `pathname` from the current location.
  const { pathname } = useLocation();

  // This effect runs every time the `pathname` changes.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // This component does not render any visible UI.
  return null;
}

export default ScrollToTop;