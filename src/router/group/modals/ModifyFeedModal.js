import React, { useEffect, useState } from 'react'
import { Modal, Button, Form, Container } from 'react-bootstrap'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import { useParams } from 'react-router-dom';


const ModifyFeedModal = ({show, onHide, grpFeedNo}) => {

    useEffect(()=>{
        if(show){
            loadPost();
        }
    },[show])
    
    const [content, setContent] = useState('');
    const [setting, setSetting] = useState('');

    const [saveFileNameArr, setSaveFileNameArr] = useState([""]);
    const [filePath, setFilePath] = useState('');

    // 원본 가져오기
    const loadPost = async () => {
        axios.get("http://localhost:3000/group/loadPost", {params:{"grpFeedNo":grpFeedNo}})
        .then(function(res){
            setContent(res.data.loadPost.grpFeedContent);
            setSetting(res.data.loadPost.grpFeedSetting === "전체 공개" ? "전체 공개" : "멤버 공개");
            console.log(setting);
        })
        .catch(function(err){
            alert(err);
        })
    }

    // 피드 수정하기
    const modifyFeed = (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append("grpFeedNo", grpFeedNo);
        formData.append("grpFeedContent", content);
        formData.append("grpFeedSetting", setting);

        axios.post("http://localhost:3000/group/feedModify", formData)
        .then(function(res){
            alert(res.data);
            window.location.reload();
        })
        .catch(function(err){
            alert(err);
        })
    }

    const customUploadAdapter = (loader) => {
        return {
        upload() {
            return new Promise((resolve, reject) => {
            const upload = new FormData();
            loader.file.then((file) => {
                if (file.size > 1024 * 1024 * 1) {
                alert("1MB 이하의 이미지만 업로드 가능합니다.");          //사진 용량 제한
                return;                                                  // 용량 제한으로 업로드가 되지 않는 사진의 처리가 필요한 부분 같습니다.
                }

                upload.append("upload", file);

                axios
                .post("http://localhost:3000/group/imageUpload", upload)
                .then((res) => {
                    setFilePath(res.data);
                    console.log(`http://localhost:3000/${res.data}`);
                    //setSaveFileNameArr([...saveFileNameArr, file.name]);

                    // if (!flag) {
                    //   setFlag(true);
                    //   setFlagImage(res.data.filename);
                    // }
                    resolve({
                    default: `http://localhost:3000/${res.data}`,
                    });
                    setSaveFileNameArr((prev) => [...prev, `http://localhost:3000/${res.data}`]);
                })
                .catch((err) => {
                    console.log("사진 업로드 실패");
                    reject(err);
                });
            });
            });
        },
        };
    }; // end of customUploadAdapter

   function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return customUploadAdapter(loader);
    };
  }; // end of uploadPlugin


  return (
    <Modal
    show={show}
    onHide={onHide}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
  >
    <Container>
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        Modify Feed
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <Form name="frm" onSubmit={modifyFeed}>
      <Form.Group className="mb-3">
        <CKEditor
          config={{
            extraPlugins: [uploadPlugin],
          }}
          data={content}
          editor={ClassicEditor}
          onChange={ (event, editor) => {
            const data = editor.getData();
            setContent(data);
          }}
        />
        {/* <Form.Control
          placeholder="내용을 입력해주세요"
          onChange={(e)=>{setContent(e.target.value)}}
          
          /> */}
      </Form.Group>
      <Form.Group className="mb-3">
      <Form.Check
            inline
            label="전체 공개"
            type="radio"
            value="전체 공개"
            checked={setting === "전체 공개"}
            onChange={(e)=>{setSetting(e.target.value); console.log(setting)}}
          />
          <Form.Check
            inline
            label="멤버 공개"
            type="radio"
            value="멤버 공개"
            checked={setting === "멤버 공개"}
            onChange={(e)=>{setSetting(e.target.value); console.log(setting)}}
          />
      </Form.Group>
    <Button variant="primary" type="submit">
        Modify
    </Button>
    </Form>
    </Modal.Body>
    <Modal.Footer>
    </Modal.Footer>
  </Container>
  </Modal>
  )

}

export default ModifyFeedModal