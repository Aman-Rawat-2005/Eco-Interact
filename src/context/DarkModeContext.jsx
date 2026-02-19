// ✅ FIXED: This file should just re-export from App
import { useDarkMode, DarkModeContext } from '../App';

export { useDarkMode, DarkModeContext };
export default DarkModeContext;