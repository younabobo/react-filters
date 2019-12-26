import React from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab';
import PropTypes from 'prop-types';

/**
 * Component that renders a button with a label and icon.
 */
function ButtonComponent({
  type, disabled, color, label, size, icon, onClick, children,
}) {
  const ButtonComp = type === 'button' ? Button : Fab;
  return (
    <ButtonComp color={color} variant="contained" size={size} disabled={disabled} onClick={onClick}>
      <span style={{ display: 'flex', justifyContent: 'space-between' }}>
        {label}
        <Icon>{icon}</Icon>
        {children}
      </span>
    </ButtonComp>
  );
}

ButtonComponent.propTypes = {
  /**
   * ButtonComponent type
   */
  type: PropTypes.oneOf('button', 'fab'),
  /**
   * Disabled button?
   */
  disabled: PropTypes.bool,
  /**
   * ButtonComponent's color
   */
  color: PropTypes.string,
  /**
   * ButtonComponent's label
   */
  label: PropTypes.string,
  /**
   * ButtonComponent's size
   */
  size: PropTypes.oneOf('small', 'medium', 'large'),
  /**
   * ButtonComponent's icon
   */
  icon: PropTypes.node,
  /**
   * Callback fired upon clicking the button
   */
  onClick: PropTypes.func,
  /**
   * Children components to display inside of the button if needed
   */
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

ButtonComponent.defaultProps = {
  type: 'fab',
  disabled: false,
  color: 'default',
  label: '',
  size: 'large',
  icon: null,
  onClick: () => {},
  children: null,
};
export default ButtonComponent;
