// @Packages
import { useState, useRef, Fragment } from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-modal';
import Select from 'react-select';
import {  useForm, Controller } from 'react-hook-form';
import cogoToast from 'cogo-toast';
import Cropper from 'react-cropper';
import cn from 'classnames';
import 'cropperjs/dist/cropper.css';

// @Project
import PetService from 'services/PetService';
import DefaultAvatar from 'assets/avatar.png';
import Loading from 'components/Loading';
import { selectSpecies } from 'selectors/species';

// @Own
import './styles.scss';
import { BackendResponse } from 'interfaces/app';
import { Pet } from 'interfaces/pet';

// Declarations
interface formFields {
  specie: {
    id: number,
    name: string
  };
  name: string;
  extra: string;
};

Modal.setAppElement('#root')

const customStyles = {
  content: {
    width: 500,
    minHeight: 380,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}

interface IProps {
  onSuccess(newPet: Pet): any,
  onFailure(): any,
  onCloseRequest(): any,
  visible: boolean
};

const AddPetModal: React.FC<IProps> = ({
  onSuccess,
  onFailure,
  onCloseRequest,
  visible,
}) => {
  const species = useSelector(selectSpecies);

  const [loading, setLoading] = useState<boolean>(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<any>();
  const [cropDetails, setCropDetails] = useState<any>(null);
  const [base64Photo, setBase64Photo] = useState<any>(null);
  const [cropMode, setCropMode] = useState<boolean>(false);
  const { handleSubmit, control, register } = useForm();
  const cropper = useRef<HTMLImageElement | any>(null);

  const onFormSubmit = (formFields: formFields) => {
    let payload: any = {
      specie_id: formFields?.specie?.id,
      name: formFields.name,
      extra: formFields.extra
    }

    if(uploadedPhoto) {
      payload['profile_picture'] = uploadedPhoto;
      payload['x'] = Math.round(cropDetails.x);
      payload['y'] = Math.round(cropDetails.y);
      payload['width'] = Math.round(cropDetails.width);
      payload['height'] = Math.round(cropDetails.height);
    }

    setLoading(true);

    PetService.addNewPet(payload)
      .then((response: BackendResponse) => {
        setBase64Photo(null);
        setUploadedPhoto(null);
        setCropDetails(null)
        onSuccess(response.data);
      })
      .catch(onFailure)
      .then(() => setLoading(false));
  }

  const handleFileSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files != null) {
      setUploadedPhoto(e.target.files[0]);
      readFileAsBase64(e.target.files[0])
        .then((base64) => {
          setBase64Photo(base64)
          setCropMode(true);
        })
    }
  }

  const onCropMove = (cropInfo: any) => {
    setCropDetails(cropInfo.detail)
  }
  const confirmCrop = () => {
    setCropMode(false);
  }

  const cancelCrop = () => {
    setCropMode(false);
    setBase64Photo(null);
    setUploadedPhoto(null);
    setCropDetails(null)
  }

  const readFileAsBase64 = (file: File): Promise<any> => {
    return new Promise((res, rej) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => res(fileReader.result);
      fileReader.onerror = (error) => rej(error);
    })
  };

  return (
    <Modal
      isOpen={visible}
      style={customStyles}
      onRequestClose={onCloseRequest}
      className="addpetmodal"
    >
      <Loading visible={loading} />
      <div className={cn("addpetmodal__photo mb-4", { 'addpetmodal__photo--expanded': cropMode })}>
        {cropMode && (
          <div className="d-flex flex-column">
            <Cropper
              ref={cropper}
              src={base64Photo}
              style={{ maxHeight: 500, width: '100%' }}
              className="AAAAAAAAAA"
              // Cropper.js options
              dragMode='move'
              zoomable={false}
              aspectRatio={1}
              crop={onCropMove}
              viewMode={2}
              responsive={true}
              guides={false}
            />
            <div className="d-flex justify-content-end mt-4">
              <button className="btn btn-sm me-3" onClick={cancelCrop}>Nevermind</button>
              <button className="btn btn-primary btn-sm" onClick={confirmCrop}>I like it!</button>
            </div>
          </div>
        )}
        {!cropMode && (
          <Fragment>
            <img src={base64Photo || DefaultAvatar} className="addpetmodal__photo-image" />
            <input onChange={handleFileSubmit} type="file" style={{position: 'absolute', width: 100, height: 100, opacity: 0,}}/>
          </Fragment>
        )}
      </div>
      {!cropMode && (
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="row">
            <div className="form-group col-6">
              <label htmlFor="name"><small>Name</small></label>
              <input
                className="form-control"
                name="name"
                ref={register({ required: true })}
                placeholder="Doge"
              />
            </div>
            <div className="form-group col-6">
              <label htmlFor="specie_id"><small>Is a...</small></label>
              <Controller
                name="specie"
                control={control}
                placeholder="Flying dragon"
                options={species}
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.id}
                as={Select} 
              />
            </div>
          </div>
          <div className="form-group mt-3">
            <label htmlFor="extra"><small>Extra information</small></label>
            <textarea
              ref={register({ required: true })}
              className="form-control"
              name="extra"
              placeholder="Has a small white stink in the left side"
            ></textarea>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-primary btn-sm">Woof! I mean, submit!</button>
          </div>
        </form>    
      )}
    </Modal>
  );
}

export default AddPetModal;