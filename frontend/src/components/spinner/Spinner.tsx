import React  from 'preact';
import './spinner.css';

function Spinner({ className }: { className?: string }) {
  return (
    <i className={'gg-spinner' + (className ? ` ${className}` : '')} />
  );
}

export default Spinner;
