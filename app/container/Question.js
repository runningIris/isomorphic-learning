import {loadQuestionDetail} from 'actions/questions';
import PropTypes from 'prop-types';

class Question extends Component {
  static fetchData ({store, params, history}) {
    let {id} = params;
    return store.dispatch(loadQuestionDetail(id, history));
  }

  
}
