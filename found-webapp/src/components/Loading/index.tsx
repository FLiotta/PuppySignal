// @Packages
import { Fragment } from 'react';

// @Own
import './styles.scss';

interface IProps {
  visible?: boolean
};

const Loading: React.FC<IProps> = ({ visible }) => {
  return (
    <Fragment>
      {visible && (
        <div className="loading">
          <p>Loading...</p>
        </div>
      )}
    </Fragment>
  );
}

export default Loading;