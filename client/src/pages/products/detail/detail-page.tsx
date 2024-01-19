import { useParams } from 'react-router-dom';

export const DetailPage = () => {
  const { id } = useParams();

  return <div>DetailPage {id}</div>;
};
