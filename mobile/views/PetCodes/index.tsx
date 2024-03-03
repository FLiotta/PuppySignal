// @Packages
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Share from 'react-native-share';
import QR from 'react-native-qrcode-svg';
import RNFS from 'react-native-fs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useRef, useState } from 'react';
import Toast from 'react-native-toast-message';
import config from 'react-native-config';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// @Project
import { PetStackParamList } from '../PetStack';
import { useGetPetCodesQuery } from '../../api/pet';
import { PRIMARY_COLOR } from '../../styles';

// @ Own
import styles from './styles';


type Props = NativeStackScreenProps<PetStackParamList, 'PetCodes'>;

const PetCodesView: React.FC<Props> = ({ route }) => {
  const { data, isLoading, isSuccess } = useGetPetCodesQuery({ id: route.params.id });

  const [selectedCodeIndex, setSelectedCodeIndex] = useState<number>(0);
  const QrCodeRef = useRef()

  const onShareQr = () => {
    if(!QrCodeRef.current) {
      return
    }

    const QRCode = data![selectedCodeIndex].code;

    // @ts-ignore
    QrCodeRef.current.toDataURL((data: string) => {
      const shareImageBase64 = {
        title: "Share your code with others",
        message: `Hello! This is my pet's code (${QRCode})!`,
        url: `data:image/png;base64,${data}`
      };

      Share.open(shareImageBase64)
    })
  }

  const onDownloadQr = async () => {
    if(!QrCodeRef.current) {
      return
    }

    const QRCode = data![selectedCodeIndex].code;

    // @ts-ignore
    QrCodeRef.current.toDataURL(async (data: string) => {
      const imagePath = `${RNFS.DownloadDirectoryPath}/${QRCode}.png`;
      
      try {
        await RNFS.writeFile(imagePath, data, 'base64')
        Toast.show({
          text1: "File saved on Download folder 🥳🎉",
          type: 'success',
          position: 'bottom'
        })
      } catch (e) {
        Toast.show({
          text1: "File can't be generated",
          text2: 'Try again later, or contact an administrator in case it persists.',
          type: 'error',
          position: 'bottom'
        })
      }
    })
  }

  if (isLoading || !isSuccess) {
    return (
      <View style={styles.container}>
        <View style={styles.codeCard}>
          <ActivityIndicator color={PRIMARY_COLOR} size='large' />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.codeCard}>
        <QR
          value={config.FOUND_QR_PATH + data[selectedCodeIndex].code}
          size={140}
          getRef={(ref?) => {
            QrCodeRef.current = ref
          }}
        />
        <Text style={styles.qrText}>{data[selectedCodeIndex].code}</Text>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={onShareQr}>
            <FontAwesome name="share-alt" size={20} color={PRIMARY_COLOR} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onDownloadQr}>
            <FontAwesome name="download" size={20} color={PRIMARY_COLOR} />
          </TouchableOpacity>
        </View>
      </View>
      {data.length > 1 && (
        <View style={styles.paginator}>
          <TouchableOpacity
            style={styles.button} 
            onPress={() => setSelectedCodeIndex(selectedCodeIndex - 1)}
            disabled={selectedCodeIndex === 0}
          >
            <FontAwesome name="arrow-left" size={20} color={PRIMARY_COLOR} />
          </TouchableOpacity>

          <Text>{selectedCodeIndex + 1} / {data.length}</Text>
          
          <TouchableOpacity
            style={styles.button}
            onPress={() => setSelectedCodeIndex(selectedCodeIndex + 1)}
            disabled={selectedCodeIndex === data.length - 1}
          >
            <FontAwesome name="arrow-right" size={20} color={PRIMARY_COLOR} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

export default PetCodesView;