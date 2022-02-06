'use strict';
import React, { PureComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GoogleVisionBarcodesDetectedEvent, Barcode, RNCamera } from 'react-native-camera';
import { COLORS } from '../../styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface IQRCode {
  bounds: {
    origin: {
      x: number, 
      y: number
    }, 
    size: {
      height: number, 
      width: number
    }
  }, 
  data: string, 
  rawData: string,
  type: string
}


interface ICamera {
  onPhotoTakes?(data: IQRCode): void,
  QrMode?: boolean,
  onQrScan?(data: IQRCode): void,
  controlsVisible?: boolean,
  goBackControl?: boolean,
  onGoBackPress?(): void,
}

class CameraComponent extends PureComponent<ICamera> {
  camera: any;
  flashIcons: any;
  state: {
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    qrVisible: boolean,
    flashMode: 'on' | 'off' | 'torch',
    loading: boolean
  }
  
  constructor(props: any) {
    super(props);

    this.state = {
      qrVisible: false,
      flashMode: 'off',
      loading: false
    }
    this.flashIcons = {
      off: 'flash-off',
      on: 'flash',
      torch: 'flash-alert'
    }
    this.handleQrScan = this.handleQrScan.bind(this);
    this.toggleFlash = this.toggleFlash.bind(this);
  };

  toggleFlash() {
    let newFlashMode = '';
    switch(this.state.flashMode) {
      case 'off':
        newFlashMode = 'on';
        break;
      case 'on':
        newFlashMode = 'torch';
        break;
      case 'torch':
      default:
        newFlashMode = 'off';
        break;
    }

    this.setState({
      flashMode: newFlashMode
    })
  };

  handleQrScan(data: GoogleVisionBarcodesDetectedEvent) {
    if(this.props?.QrMode && this.props?.onQrScan) {
      //"type": "QR_CODE",
      const firstQR: any = data.barcodes.find((code: any) => code.type === "QR_CODE");

      if(firstQR) {
        const { bounds } = firstQR;

        this.setState({
          qrVisible: true,
          x: bounds?.origin?.x,
          y: bounds?.origin?.y,
          width: bounds?.size?.width + 50,
          height: bounds?.size?.height + 50
        })
        
        this.props.onQrScan(firstQR)
      } else {
        this.setState({
          qrVisible: false
        });
      }
    };
  };

  render() {
    return (
      <View style={styles.container}>
        {this.props.goBackControl && (
          <TouchableOpacity 
            onPress={this.props.onGoBackPress}
            style={{ position: 'absolute', top: 45, left: 15, flexDirection: 'row', alignItems: 'center', zIndex: 1000 }}>
            <FontAwesome color="#ffffff" name="chevron-left" size={25} />
            <Text style={{ color: '#ffffff', marginLeft: 15 }}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={this.toggleFlash}
          style={{ position: 'absolute', top: 45, right: 15, flexDirection: 'row', alignItems: 'center', zIndex: 1000 }}
        >
          <MaterialCommunityIcons color="#ffffff" name={this.flashIcons[this.state.flashMode]} size={25} />
        </TouchableOpacity>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode[this.state.flashMode]}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={this.handleQrScan}
          captureAudio={false}
        />
        {this.state.qrVisible && (
          <View
            style={{
              ...styles.qrOverlap,
              top: this.state.y,
              left: this.state.x,
              width: this.state.width,
              height: this.state.height
            }}
          >
          </View>
        )}
        {this.props.QrMode && (
          <View style={styles.qrGuideWrapper}>
            <View style={styles.qrGuide}></View>
          </View>
        )}
        {this.props.controlsVisible && (
          <View style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center'
          }}>
            <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  takePicture = async () => {
    this.setState({ loading: true });

    if (this.camera && !this.state.loading) {
      const options = {
        quality: 0.5, 
        base64: false, 
        fixOrientation: true,
        pauseAfterCapture: true,
      };
      const data = await this.camera.takePictureAsync(options);

      if(this.props?.onPhotoTakes) { 
        this.props.onPhotoTakes(data);
      }
    }
  };
}

const styles = StyleSheet.create({
  qrGuideWrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  qrGuide: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 16,
    borderStyle: 'dashed'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 9999,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 500,
    width: 75,
    height: 75,
    borderWidth: 3,
    borderColor: COLORS.primary_color,
    bottom: 50,
    opacity: 0.8,
    elevation: 4
  },
  qrOverlap: {
    backgroundColor: COLORS.primary_color,
    position: 'absolute',
    opacity: 0.7
  }
});

export default CameraComponent;