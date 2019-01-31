#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(RNReactNativeGutenbergBridge, NSObject)

RCT_EXTERN_METHOD(provideToNative_Html:(NSString *)html title:(NSString *)title changed:(BOOL)changed)
RCT_EXTERN_METHOD(requestMediaPickFrom:(NSString *)source callback:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(mediaUploadSync)
RCT_EXTERN_METHOD(requestImageFailedRetryDialog:(NSInteger)mediaID)
RCT_EXTERN_METHOD(requestImageUploadCancelDialog:(NSInteger)mediaID)
RCT_EXTERN_METHOD(editorDidLayout)

@end
