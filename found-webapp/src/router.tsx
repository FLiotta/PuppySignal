// @Packages
import { BrowserRouter, Routes, Route} from 'react-router-dom';

// @Project
import Found from 'pages/Found';
import NotFound from 'pages/NotFound';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Found />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
};

export default AppRouter;
