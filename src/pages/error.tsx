import { useRouteError } from "react-router-dom";
import React from 'react';
import { Button, Result } from 'antd';
const ErrorPage: React.FC = () => {
  const error: any = useRouteError();
  console.error(error);

  return (
    <Result
        status= {error.status || 404}
        title="404"
        subTitle= {error.statusText || error.message} 
        extra={ <Button type="primary" href="/">Back Home</Button> }
    />
  );
}
export default ErrorPage;

