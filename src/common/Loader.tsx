import React, {FunctionComponent} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';

type custom = 'large' | 'small';

interface loaderData {
  showModal: boolean;
  LoaderColor: string;
  LoaderSize: number | custom;
}

const Loaders: FunctionComponent<loaderData> = ({
  showModal,
  LoaderColor,
  LoaderSize,
}: loaderData) => {
  return (
    <Modal
      isVisible={showModal}
      backdropColor="rgba(0,0,0,0.8)"
      animationIn="zoomInDown"
      animationOut="zoomOutUp"
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}>
      <View style={[styles.container]}>
        <ActivityIndicator color={LoaderColor} size={LoaderSize} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: responsiveWidth(20),
    height: responsiveHeight(10),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderRadius: 8,
  },
});

export default Loaders;
