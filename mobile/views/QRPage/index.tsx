// @Packages
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, PermissionsAndroid } from 'react-native';
import Share from 'react-native-share';
import Carousel from 'react-native-snap-carousel';
import QR from 'react-native-qrcode-svg';
import { RouteProp } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

// @Project
import SizeSelectModal from '../../components/SizeSelectModal';
import { COLORS } from '../../styles';
import { getPetCodes } from 'services/pet';
import config from '../../config';
import { ICode } from 'interfaces';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface IProps {
  navigation: any,
  route: RouteProp<{
    params: {
      id: number
    }
  }, 'params'>
}
const QRPage: React.FC<IProps> = ({
  route
}) => {
  const [loading, setLoading] = useState(true);
  const [sizeModalVisible, setSizeModalVisible] = useState<boolean>(false);
  const [focusedQrIndex, setFocusedQrIndex] = useState<number | undefined>();
  const [codes, setCodes] = useState<ICode[]>([]);
  const [qrsCodesRefs, setQrsCodesRefs] = useState<any>({});
  const carouselRef = useRef<any>();

  useEffect(() => {
    setLoading(true);

    getPetCodes(route.params.id)
      .then((response) => {
        const codes = response.data.data;

        setCodes(codes);
      })
      .catch(() => {})
      .then(() => setLoading(false));
  }, []);
  
  const buildUrl = (code: ICode) => `${config.FOUND_QR_PATH}${code.code}`
  
  // TODO: Que pasa si no hay ningun QR? mostrar la pagina en vacio?

  const renderItem = ({ item, index }: any) => (
    <View>
        <View style={styles.wrapper} key={item.code}>
        <QR
          size={150}
          value={buildUrl(item)}
          //TODO: logo={AppIcon}
          logoBackgroundColor='#fff'
          logoSize={32}
          logoBorderRadius={100}
          logoMargin={5}
          getRef={(ref?) => {
            if(!qrsCodesRefs[index]) {
              const temp_qrscodes = Object.assign(qrsCodesRefs);

              temp_qrscodes[index] = ref;

              setQrsCodesRefs(temp_qrscodes);
            }
          }}
        />
        <Text style={styles.name}>{item.code}</Text>
      </View>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 44
      }}>
        <TouchableOpacity onPress={() => shareImageFromQr(index)}>
          <View style={{
            alignItems: "center"
          }}>
            <FontAwesome name="share-alt" size={24} color={COLORS.primary_color} />
            <Text style={{ color: COLORS.primary_color }}>Share</Text>
          </View>
        </TouchableOpacity>
        <Menu>
          <MenuTrigger>
            <TouchableOpacity>
              <View style={{
                alignItems: "center"
              }}>
                <FontAwesome name="download" size={24} color={COLORS.primary_color} />
                <Text style={{ color: COLORS.primary_color }}>Download</Text>
              </View>
            </TouchableOpacity>
          </MenuTrigger>
          <MenuOptions
            optionsContainerStyle={{
              marginLeft: 60,
              marginTop: 10, 
              width:250
            }}
          >
            <MenuOption 
              onSelect={() => downloadImageFromQr(index)}  
              style={styles.customDropmenuOption}
            >
              <FontAwesome
                name="file-image-o" 
                size={12} 
                color={'#000'}
                style={{ marginRight: 10 }} 
              />
              <Text>Save as image</Text>
            </MenuOption>
            <MenuOption 
              onSelect={() => {
                setFocusedQrIndex(index);
                setSizeModalVisible(true);
              }}
              style={styles.customDropmenuOption}
            >
              <FontAwesome
                name="file-pdf-o" 
                size={12} 
                color={'#000'}
                style={{ marginRight: 10 }} 
              />
              <Text>Save as ready to print PDF</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );

  const generatePdfFromQr = async (index: number, w: number, h: number) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        
        qrsCodesRefs[index].toDataURL(async (base64QR: any) => {
          const DPI = 96;
          const CM = 1 / (2.54 / DPI); 
    
          let options = {
            html: `
              <div>
                <img
                  src="data:image/png;base64,${base64QR}" 
                  style="width: ${CM * w}px; height: ${CM * h}px;"
                />
              </div>
            `,
            fileName: `PuppySignal_code_${codes[index].code}`,
            directory: 'Documents',
          };
    
          await RNHTMLtoPDF.convert(options)

          Toast.show({
            text1: "File saved at your Documents folder 🥳🎉",
            type: 'success',
            position: 'bottom'
          })
        });

      } else {
        return false;
      }
    } catch (err) {
      Toast.show({
        text1: "File can't be generated",
        text2: 'Try again later.',
        type: 'error',
        position: 'bottom'
      })
      return false;
    }
  }

  const shareImageFromQr = (index: number) => {
    qrsCodesRefs[index].toDataURL((data: any) => {
      const shareImageBase64 = {
        title: "Share your code with others",
        message: `Hello! This is my pet's code!`,
        url: `data:image/png;base64,${data}`
      };

      Share.open(shareImageBase64)
    });
  }

  const downloadImageFromQr = async (index: number) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        qrsCodesRefs[index].toDataURL((data: any) => {
          const imagePath = `${RNFS.PicturesDirectoryPath}/${codes[index].code}.png`;
          RNFS.writeFile(imagePath, data, 'base64')
            .then(() => {
              Toast.show({
                text1: "QRCode saved 🥳🎉",
                type: 'success',
                position: 'bottom'
              })
            })
            .catch(() => {
              Toast.show({
                text1: "QRCode can't be saved",
                text2: 'Try again later.',
                type: 'error',
                position: 'bottom'
              })
            })
        })
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  const handleSizeSelectModalSubmit = (w: number, h: number) => {
    if(focusedQrIndex === undefined) {
      return
    }

    setSizeModalVisible(false);
    
    generatePdfFromQr(focusedQrIndex, w, h);
  }

  return (
    <View style={styles.container}>
      <SizeSelectModal
        title="Ready to print PDF"
        onSubmit={handleSizeSelectModalSubmit}
        isVisible={sizeModalVisible}
        onClose={() => setSizeModalVisible(false)}
      />
      <View style={{
        height: 350,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Carousel
          ref={(c) => carouselRef.current = c}
          data={codes}
          renderItem={renderItem}
          sliderWidth={Dimensions.get('screen').width}
          contentContainerCustomStyle={{
            height: 325, 
            alignItems: 'center', 
          }}
          itemWidth={200}
          layout="default"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.bg_color,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  wrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 24,
    alignItems: 'center',
    shadowColor: "#000",
    elevation: 1
  },
  name: {
    marginTop: 25,
  },
  customDropmenuOption: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default QRPage;
