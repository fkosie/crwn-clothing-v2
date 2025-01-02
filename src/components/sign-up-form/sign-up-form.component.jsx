import { useState } from 'react';
import { Form } from 'react-router-dom';

import { 
  createUserDocumentFromAuth,
  createAuthUserWithEmailAndPassword, } from "../../utils/firebase/firebase.utils";

import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';

import './sign-up-form.styles.scss';

const defaultFormFields = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: ''
};

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password, confirmPassword } = formFields;

  console.log(formFields);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      const response = await createAuthUserWithEmailAndPassword(email, password);
      console.log(response);
      const { user } = response;
      await createUserDocumentFromAuth(user, {displayName});
      setFormFields(defaultFormFields);
    } catch (error) {
      if(error.code === 'auth/email-already-in-use') {
        alert('Email is already in use');
      } else {
        console.log(error);
      }
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  }

  return (
    <div className='sign-up-container'>
      <h2>Don't have an account?</h2>
      <span>Sign up with your email and password</span>
      <form onSubmit={() => {}}>
        <FormInput
          label='Display Name'
          inputOptions = {{
            type: 'text',
            required: true,
            onChange: handleChange,
            name: 'displayName',
            value: displayName
          }}
        />
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
        <FormInput
          label='Confirm Password'
          inputOptions = {{
            type: 'password',
            required: true,
            onChange: handleChange,
            name: 'confirmPassword',
            value: confirmPassword
          }}
        />
        <div className='buttons-container'>
          <Button buttonType='default' type='submit' required onClick={handleSubmit}>Sign Up</Button>
        </div>
      </form>
    </div>
  );
}

export default SignUpForm;