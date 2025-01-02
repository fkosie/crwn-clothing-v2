import './button.styles.scss';

const BUTTON_TYPE_CLASSES = {
  google: 'google-sign-in',
  inverted: 'inverted',
  default: 'default',
}

// This appears to be destructuring the props object to get the children and buttonType properties.
// Also, it appears that the buttonType property is being used to determine the class name of the button.
// The class name is determined by the BUTTON_TYPE_CLASSES object, which maps button types to class names.
// The button component renders a button element with the appropriate class name based on the button type.
// The children of the button component are rendered inside the button element.
// The button component also spreads any other props passed to it onto the button element.
const Button = ({children, buttonType, ...otherProps}) => {
  return(
    <button 
      className={`button-container ${BUTTON_TYPE_CLASSES[buttonType]}`}
      {...otherProps}
    >
      {children}
    </button>
  );
}

export default Button;