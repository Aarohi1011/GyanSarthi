export const studentActions = {
  SET_STUDENTS: 'SET_STUDENTS',
  ADD_STUDENT: 'ADD_STUDENT',
  UPDATE_STUDENT: 'UPDATE_STUDENT',
  DELETE_STUDENT: 'DELETE_STUDENT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

export const studentReducer = (state, action) => {
  switch (action.type) {
    case studentActions.SET_STUDENTS:
      return {
        ...state,
        students: action.payload,
        loading: false,
        error: null
      };
    
    case studentActions.ADD_STUDENT:
      return {
        ...state,
        students: [...state.students, action.payload],
        loading: false,
        error: null
      };
    
    case studentActions.UPDATE_STUDENT:
      return {
        ...state,
        students: state.students.map(student =>
          student.id === action.payload.id ? action.payload : student
        ),
        loading: false,
        error: null
      };
    
    case studentActions.DELETE_STUDENT:
      return {
        ...state,
        students: state.students.filter(student => student.id !== action.payload),
        loading: false,
        error: null
      };
    
    case studentActions.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case studentActions.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    default:
      return state;
  }
};

export const initialState = {
  students: [],
  loading: false,
  error: null
};