import { useState, useEffect } from 'react';

import { 
  signInWithGooglePopup, 
  signInWithGoogleRedirect, 
  createUserDocumentFromAuth,
  signInAuthUserWithEmailAndPassword,
  signOutUser,
  //onAuthStateChangedListener,
  getCurrentUser,
  getRedirectResult,
} from "../../utils/firebase/firebase.utils";

import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';

import './sign-in-form.styles.scss';
import { signOut } from 'firebase/auth';

const defaultFormFields = {
  email: '',
  password: '',
};

const SignInForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;

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

    // This is used during redirect sign-in
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
     /*
        try {
          const result = await getRedirectResult()
        } catch (error) {
          console.log(error) // Debug errors from redirect response
        }
      */
    };

    checkAuth();
  }, []);
  
  const logGooglePopupUser = async () => {
    try {
      const response = await signInWithGooglePopup();
      console.log(response);
      resetFormFields();
      createUserDocumentFromAuth(response.user);
    } catch (error) {
      console.error('Error during popup signin:', error);
    }
  }
  const logGoogleRedirectUser = async () => {
    try {
      console.log('Starting Google redirect sign-in...');
      const response = await signInWithGoogleRedirect();
      // !!Note: Code after this line won't execute due to redirect!!
    } catch (error) {
      console.error('Error during redirect signin:', error);
    }
  }

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await signInAuthUserWithEmailAndPassword(email, password);
      console.log(response);
      resetFormFields();
    } catch(error) {
      switch(error.code) {
        case 'auth/invalid-email':
          alert('Invalid email address');
          break;
        case 'auth/missing-password':
          alert('Missing password');
          break;
        case 'auth/invalid-credential':
          alert('Invalid credential');
          break;
      }
      console.log(error);
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  }

  return (
    <div className='sign-in-container'>
      <h2>I already have an account</h2>
      <span>Sign in with your email and password</span>
      <form onSubmit={() => {}}>
        <FormInput
          label='Email'
          inputOptions = {{
            type: 'email',
            required: true,
            onChange: handleChange,
            name: 'email',
            value: email
          }}
        />
        <FormInput
          label='Password'
          inputOptions = {{
            type: 'password',
            required: true,
            onChange: handleChange,
            name: 'password',
            value: password
          }}
        />
        <div className='buttons-container'>
          <Button type='submit' buttonType='default' type='Sign In' required onClick={handleSubmit}>Sign In</Button>
          <Button type='button' buttonType='google' onClick={logGooglePopupUser}>
            Sign In with Google Popup
          </Button>
          <Button type='button' buttonType='google' onClick={logGoogleRedirectUser}>
            Sign In with Google Redirect
          </Button>
        </div>
      </form>
      <Button type='button' buttonType='inverted' onClick={signOutUser}>
        Sign Out
      </Button>
    </div>
  );
}

export default SignInForm;