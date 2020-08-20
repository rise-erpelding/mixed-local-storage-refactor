import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <p>404 Page not found</p>
      <Link to="/">
        Back to main page
      </Link>
    </div>
  );
}
