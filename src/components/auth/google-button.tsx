'use client';

import { config } from '@/lib/config';
import { useEffect, useRef } from 'react';

// Add global window type declaration if not already present
declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize?: (config: any) => void;
          renderButton?: (element: HTMLElement, config: any) => void;
          prompt?: () => void;
        };
      };
    };
    googleAuthCallback?: (response: any) => void;
  }
}

interface GoogleAuthButtonProps {
  // Pass the actual callback from the parent (SignIn or SignUp logic)
  handleGoogleAuthCallback: (response: any) => void;
  setStatus: ({ status, message }: { status: any; message: string }) => void;
  buttonText: 'signin_with' | 'signup_with';
  buttonContext: 'signin' | 'signup' | 'use';
}

export default function GoogleAuthButton({ handleGoogleAuthCallback, setStatus, buttonText, buttonContext }: GoogleAuthButtonProps) {
  const handleGoogleAuthCallbackRef = useRef(handleGoogleAuthCallback);
  useEffect(() => {
    handleGoogleAuthCallbackRef.current = handleGoogleAuthCallback;
  }, [handleGoogleAuthCallback]);

  useEffect(() => {
    setStatus({ status: 'page_loading', message: '' });

    window.googleAuthCallback = (response: any) => {
      handleGoogleAuthCallbackRef.current(response);
    };

    if (window.google?.accounts?.id) {
      // initialize only once for all buttons
      if (typeof window.google.accounts.id.initialize === 'function') {
        window.google.accounts.id.initialize({
          client_id: config.google.client_id,
          // Use the global callback name for the GSI client
          callback: window.googleAuthCallback,
          auto_select: true,
          itp_support: true,
        });
      }
      // prompt can be called multiple times if needed, but often auto_select handles it
      if (typeof window.google.accounts.id.prompt === 'function') {
        window.google.accounts.id.prompt();
      }

      // render the specific button instance
      const buttonContainer = document.querySelector(`.g_id_signin[data-context="${buttonContext}"]`); // Select based on data-context or a unique ID
      if (buttonContainer && typeof window.google.accounts.id.renderButton === 'function') {
        window.google.accounts.id.renderButton(buttonContainer as HTMLElement, {
          type: 'standard',
          shape: 'pill',
          theme: 'outline',
          text: buttonText,
          size: 'large',
          logo_alignment: 'left',
        });
        setStatus({ status: 'null', message: '' });
      } else {
        setStatus({ status: 'error', message: `There was an issue loading Google button for ${buttonContext}. Please try again later.` });
      }
    } else {
      // Fallback if Google script isn't loaded yet
      // This might happen if the script is loaded after the component mounts
      // Consider adding a listener or retry mechanism if this is common.
      setStatus({ status: 'error', message: 'Google Identity Services script not loaded.' });
    }

    return () => {
      // Clean up the global callback when the component unmounts,
      // but be careful if other buttons might still be using it.
      // For a single universal button, this is fine.
      delete window.googleAuthCallback;
    };
  }, [buttonContext, buttonText, setStatus]); // Depend on props that influence rendering

  return (
    <div className='flex items-center justify-center'>
      <div
        id="g_id_onload" // This should ideally be unique or handled by the top-level app
        data-client_id={config.google.client_id}
        data-context={buttonContext} // Use context to differentiate
        data-ux_mode="popup"
        data-callback="googleAuthCallback" // Refer to the global callback
        data-auto_select="true"
        data-itp_support="true"></div>

      <div
        className="g_id_signin w-full mt-4" // Use a class, but differentiate with data-context or id for renderButton
        data-type="standard"
        data-shape="pill"
        data-theme="outline"
        data-text={buttonText}
        data-size="large"
        data-logo_alignment="left"
        data-context={buttonContext} // Added data-context to help select it
      ></div>
    </div>
  );
}
