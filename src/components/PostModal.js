import styled from 'styled-components';
import { useState } from 'react';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { postArticleAPI } from '../actions';

const PostModal = (props) => {
  const [editorText, setEditorText] = useState('');
  const [shareImage, setShareImage] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [assetArea, setAssetArea] = useState('');

  const handleChange = (e) => {
    const image = e.target.files[0];

    if (image === '' || image === undefined) {
      alert(`not an image, the file is a ${typeof image}`);
      return;
    }

    setShareImage(image);
  };

  const switchAssetArea = (area) => {
    setShareImage('');
    setVideoLink('');
    setAssetArea(area);
  };

  const postArticle = (e) => {
    e.preventDefault();

    if (e.target !== e.currentTarget) {
      return;
    }

    const payload = {
      image: shareImage,
      video: videoLink,
      user: props.user,
      description: editorText,
      timestamp: firebase.firestore.Timestamp.now(),
    };

    props.postArticle(payload);
    reset(e);
  };

  const reset = (e) => {
    setEditorText('');
    setShareImage('');
    setVideoLink('');
    setAssetArea('');
    props.handleClick(e);
  };

  return (
    <>
      {props.showModal === 'open' && (
        <Container>
          <Content>
            <Header>
              <h2>Create a post</h2>
              <button onClick={(event) => reset(event)}>
                {/* <img src='/images/close.svg' /> */}
                <svg
                  onClick={(event) => reset(event)}
                  height='15'
                  viewBox='0 0 365.696 365.696'
                  width='15'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                >
                  <path d='m243.1875 182.859375 113.132812-113.132813c12.5-12.5 12.5-32.765624 0-45.246093l-15.082031-15.082031c-12.503906-12.503907-32.769531-12.503907-45.25 0l-113.128906 113.128906-113.132813-113.152344c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503907-12.5 32.769531 0 45.25l113.152344 113.152344-113.128906 113.128906c-12.503907 12.503907-12.503907 32.769531 0 45.25l15.082031 15.082031c12.5 12.5 32.765625 12.5 45.246093 0l113.132813-113.132812 113.128906 113.132812c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082031c12.5-12.503906 12.5-32.769531 0-45.25zm0 0' />
                </svg>
              </button>
            </Header>
            <SharedContent>
              <UserInfo>
                {props.user.photoURL ? (
                  <img src={props.user.photoURL} />
                ) : (
                  <img src='/images/user.svg' />
                )}
                {props.user.displayName ? (
                  <span>{props.user.displayName}</span>
                ) : (
                  <span>Name</span>
                )}
              </UserInfo>
              <Editor>
                <textarea
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  placeholder='What do you want to share?'
                  autoFocus={true}
                />
                {assetArea === 'image' ? (
                  <UploadImage>
                    <input
                      type='file'
                      accept='image/gif, image/jpeg, image/jpg, image/png'
                      name='image'
                      id='file'
                      style={{ display: 'none' }}
                      onChange={handleChange}
                    />
                    <p>
                      <label htmlFor='file'>Select an image to share</label>
                    </p>
                    {shareImage && (
                      <img src={URL.createObjectURL(shareImage)} />
                    )}
                  </UploadImage>
                ) : (
                  assetArea === 'media' && (
                    <>
                      <input
                        type='text'
                        placeholder='Please input a video link'
                        value={videoLink}
                        onChange={(e) => setVideoLink(e.target.value)}
                        style={{
                          width: '100%',
                          'margin-right': '10px',
                          'box-sizing': 'border-box',
                          'border-radius': '5px',
                          border: '1px solid black',
                          'box-shadow': 'none',
                          inset: 'none',
                          'font-weight': '600',
                          padding: '10px',
                          'margin-bottom': '10px',
                        }}
                      />
                      {videoLink && (
                        <ReactPlayer width={'100%'} url={videoLink} />
                      )}
                    </>
                  )
                )}
              </Editor>
            </SharedContent>
            <SharedCreation>
              <AttachAssets>
                <AssetButton onClick={() => switchAssetArea('image')}>
                  <img src='/images/photo-icon.svg' />
                </AssetButton>
                <AssetButton onClick={() => switchAssetArea('media')}>
                  <img src='/images/video-icon.svg' />
                </AssetButton>
              </AttachAssets>

              <ShareComment>
                <AssetButton>
                  <img src='/images/comment-icon.svg' />
                  Anyone
                </AssetButton>
              </ShareComment>

              <PostButton
                disabled={!editorText ? true : false}
                onClick={(event) => postArticle(event)}
              >
                Post
              </PostButton>
            </SharedCreation>
          </Content>
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  color: black;
  background-color: rgba(0, 0, 0, 0.8);
  animation: fadeIn 0.3s;
`;

const Content = styled.div`
  width: 100%;
  max-width: 522px;
  background-color: white;
  max-height: 90%;
  overflow: initial;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  top: 32px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: block;
  padding: 16px 26px;
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.6);
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    /* height: 40px; */
    /* width: 40px; */
    min-width: auto;
    color: rgba(0, 0, 0, 0.6);
    background: transparent;
    border: none;
    outline: none;
    padding: 0;

    svg {
      transition: all 150ms ease-in-out;
      padding: 10px;
      background: white;
      border: none;
      outline: none;
      box-shadow: none;
      /* color: rgba(0, 0, 0, 0.3); */
      /* pointer-events: none; */

      &:hover {
        color: red;
        cursor: pointer;
      }
    }
  }
`;

const SharedContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  vertical-align: baseline;
  background: transparent;
  padding: 8px 12px;
`;
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  svg,
  img {
    width: 48px;
    height: 48px;
    background-clip: content-box;
    border: 2px solid transparent;
    border-radius: 50%;
  }

  span {
    font-weight: 600;
    font-size: 16px;
    margin: 5px;
    line-height: 1.5;
  }
`;

const SharedCreation = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 24px 12px 16px;
`;

const AssetButton = styled.button`
  display: flex;
  align-items: center;
  height: 40px;
  min-width: auto;
  color: rgba(0, 0, 0, 0.5);

  &:hover {
    cursor: pointer;
  }
`;

const AttachAssets = styled.div`
  align-items: center;
  display: flex;
  padding-right: 8px;

  ${AssetButton} {
    width: 40px;
  }
`;

const ShareComment = styled.div`
  padding-left: 8px;
  margin-right: auto;
  border-left: 1px solid rgba(0, 0, 0, 0.15);

  ${AssetButton} {
    svg {
      margin-right: 5px;
    }
  }
`;

const PostButton = styled.button`
  min-width: 60px;
  border-radius: 20px;
  padding-left: 16px;
  padding-right: 16px;
  border: none;
  outline: none;
  color: ${(props) => (props.disabled ? 'slategrey' : '#fff')};
  background: ${(props) => (props.disabled ? 'rgba(0,0,0,.8)' : '#0a66c2')};
  transition: all 150ms ease-in-out;

  &:hover {
    background: ${(props) => (props.disabled ? 'rgba(0,0,0,.1)' : '#004182')};
    cursor: ${(props) => (props.disabled ? 'initial' : 'pointer')};
  }
`;

const Editor = styled.div`
  padding: 12px 24px;

  textarea {
    width: 100%;
    min-height: 100px;
    resize: none;
    font-size: 16px;
    margin-bottom: 20px;
    border: none;
    outline: none;
  }
`;

const UploadImage = styled.div`
  text-align: center;
  p label {
    font-weight: 600;
    border-radius: 10px;
    border: 1px solid #0a66c2;
    padding: 10px 15px;
    margin-bottom: 15px;
    display: block;
    transition: all 150ms ease-in-out;
    &:hover {
      cursor: pointer;
      border-color: #004182;
      color: #004182;
    }
  }
  img {
    width: 100%;
  }
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postArticle: (payload) => dispatch(postArticleAPI(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);
