import 'src/global.css';

import { useEffect } from 'react';
import { Provider } from 'react-redux';

import { usePathname } from 'src/routes/hooks';

import { store } from 'src/store';
import { ThemeProvider } from 'src/theme/theme-provider';


// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  useScrollToTop();

  // const githubButton = () => (
  //   <Fab
  //     size="medium"
  //     aria-label="Github"
  //     href="https://github.com/minimal-ui-kit/material-kit-react"
  //     sx={{
  //       zIndex: 9,
  //       right: 20,
  //       bottom: 20,
  //       width: 48,
  //       height: 48,
  //       position: 'fixed',
  //       bgcolor: 'grey.800',
  //     }}
  //   >
  //     <Iconify width={24} icon="socials:github" sx={{ '--color': 'white' }} />
  //   </Fab>
  // );

  return (
    <Provider store={store}>
      <ThemeProvider>
        {children}
        {/* {githubButton()} */}
      </ThemeProvider>
    </Provider>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
