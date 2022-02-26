import React from "react";

function formReducer(state, action) {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };

    default:
      return state;
  }
}

export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = React.useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
  });

  //useCallback allows you to define dependencies as to when a function would run again
  const inputHandler = React.useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      inputId: id,
      isValid: isValid,
      value: value,
    });
  }, []);

  return [formState, inputHandler];
};
