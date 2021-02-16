const defaultState = {

}

export default (state = defaultState, action: any) => {
  switch(action.type) {
    default:
      return state;
  };
}