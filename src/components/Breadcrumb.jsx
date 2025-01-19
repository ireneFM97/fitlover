import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/Breadcrumb.css';

const Breadcrumb = ({ paths }) => {
    return (
        <div className="breadcrumb">
            {paths.map((path, index) => (
                <span key={index}>
                    <Link
                        to={path.link}
                        className={`breadcrumb-link ${index === paths.length - 1 ? 'breadcrumb-current' : ''}`}
                    >
                        {path.name}
                    </Link>
                    {index < paths.length - 1 && ' > '}
                </span>
            ))}
        </div>
    );
};
export default Breadcrumb;
