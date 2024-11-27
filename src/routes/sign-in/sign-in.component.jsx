import { useEffect } from 'react';

import { 
  signInWithGooglePopup, 
  signInWithGoogleRedirect, 
  createUserDocumentFromAuth,
  //onAuthStateChangedListener,
  //getRedirectResult,
  getCurrentUser
} from "../../utils/firebase/firebase.utils";

import SignUpForm from '../../components/sign-up-form/sign-up-form.component';

const SignIn = () => {
  useEffect(() => {
    // const unsubscribe = onAuthStateChangedListener(async (user) => {
    //   if (user) {
    //     await createUserDocumentFromAuth(user);
    //     // Do any component-specific handling here
    //   }
    // });
    //return unsubscribe;

    // const checkRedirectResult = async () => {
    //   const result = await getRedirectResult();
    //   if (result && result.user) {
    //     await createUserDocumentFromAuth(result.user);
    //   }
    // }
    // checkRedirectResult();

    const checkAuth = async () => {
      try {
        const { userAuth, redirectResult } = await getCurrentUser();
        console.log('User Auth:', userAuth);
        console.log('Redirect Result:', redirectResult);
        
        if (userAuth) {
          await createUserDocumentFromAuth(userAuth);
          //setUser(userAuth);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        //setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logGooglePopupUser = async () => {
    const response = await signInWithGooglePopup();
    console.log(response);
    createUserDocumentFromAuth(response.user);
  }
  const logGoogleRedirectUser = async () => {
    try {
      console.log('Starting Google redirect sign-in...');
      const response = await signInWithGoogleRedirect();
      // !!Note: Code after this line won't execute due to redirect!!
    } catch (error) {
      console.error('Error during redirect:', error);
    }
  }

  return (
    <div>
      <h1>Sign In Page</h1>
      <button onClick={logGooglePopupUser}>
        Sign In with Google Popup
      </button>
      <button onClick={logGoogleRedirectUser}>
      Sign In with Google Redirect
      </button>
      <SignUpForm />
    </div>
  );
}

export default SignIn;