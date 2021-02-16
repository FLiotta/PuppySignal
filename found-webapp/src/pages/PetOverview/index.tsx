// @Packages
import { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

// @Project
import PetOverview from '../../components/PetOverview';

interface IMatch {
  id: any
};

interface IProps extends RouteComponentProps<IMatch> {};

const PetOverviewPage: React.FC<IProps> = ({
  match  
}) => {
  const [petId, setPetId] = useState<number | undefined>(undefined);
  
  useEffect(() => {
    const { id } = match.params;
    
    setPetId(id);
  })
  return (
    <div className="petoverview">
      {petId && <PetOverview petId={petId} populateOwner />}
    </div>
  );
}

export default PetOverviewPage;