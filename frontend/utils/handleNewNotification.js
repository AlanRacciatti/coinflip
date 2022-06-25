export default (dispatch, { type, message, title, icon, position }) => {
  dispatch({
    type,
    message,
    title,
    icon,
    position: position || "topR",
  });
};
