/**
 * 그룹 생성 화면
 * @Auth 해운
 */

import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from "react-cookie";

export default function CreateGroup() {

    let history = useNavigate();

    const [cookies, setCookies] = useCookies(["USER_ID","USER_NICKNAME"]);
    // cookie에 저장된 사용자 ID 및 닉네임
    const userId = cookies.USER_ID;
    const userNickName = cookies.USER_NICKNAME;

    // 그룹 생성 시, 입력할 사항
    const [grpName, setGrpName] = useState('');
    const [grpLeader, setGrpLeader] = useState('');
    const [grpImage, setGrpImage] = useState('');
    const [grpIntro, setGrpIntro] = useState('');

    useEffect(()=>{
        setGrpLeader(userId);
    },[]);

    // 그룹명 중복 확인
    const checkExistingGroup = async () => {
        axios.get("http://localhost:3000/group/checkExistingGroup", {params:{"grpName":grpName}})
        .then(function(res) {
            if(res.data === "NO") {
                alert("이미 존재하는 그룹명입니다.");
                setGrpName('');
            } else {
                alert("사용할 수 있는 그룹명입니다.");
            }
        })
        .catch(function(err){
            alert(err);
        })
    }

    const submitBtn = (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append("grpName", grpName);
        formData.append("grpLeader", grpLeader);
        formData.append("uploadFile", document.frm.uploadFile.files[0]);
        formData.append("grpIntro", grpIntro);

        axios.post("http://localhost:3000/group/createGroup", formData)
        .then(function(res) {
            if(res.data === "NO") {

            }
            alert('그룹 생성 성공');
            history("/group/NewsFeed");
        })
        .catch(function(err) {
            alert("에러");
        })
    }

    return (
        <>
            <div className="wrapper">
                <div id="content-page" className="content-page">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card position-relative inner-page-bg bg-primary" style={{height: "150px"}}>
                                    <div className="inner-page-title">
                                        <h3 className="text-white">Create Group</h3>
                                            <p className="text-white">그룹 생성</p>
                                    </div>
                                </div>
                            </div> {/*end of col-sm-12*/}
                            <div className="col-sm-12 col-lg-12">
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between">
                                        <div className="header-title">
                                            <h4 className="card-title">Input Here</h4>
                                        </div>
                                    </div> {/*end of card-header*/}
                                    <div className="card-body">
                                        <form name="frm" onSubmit={submitBtn} encType="multipart/form-data">
                                            <div className="form-group">
                                                <label className="form-label">그룹명</label>
                                                <input type="text"
                                                            className="form-control"
                                                            name="grpName"
                                                            value={grpName}
                                                            onChange={(e)=>setGrpName(e.target.value)}
                                                />
                                                <button type="button"
                                                            className="btn btn-primary my-1"
                                                            onClick={checkExistingGroup}>중복 확인</button>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label custom-file-input">그룹 대표 이미지</label>
                                                <input type="file"
                                                            className="form-control" 
                                                            name="uploadFile"
                                                            onChange={(e)=>setGrpImage(e.target.value)}
                                                            accept='*' 
                                                />
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">그룹 소개</label>
                                                <textarea class="form-control"
                                                                rows="5"
                                                                name="grpIntro"
                                                                onChange={(e)=>setGrpIntro(e.target.value)}
                                                ></textarea>
                                            </div>
                                            <div style={{align:"center"}}>
                                                <button type="submit" className="btn btn-primary">Submit</button>
                                                <button type="button" className="btn bg-danger mx-1" onClick={()=>{window.history.back()}}>Cancel</button>
                                            </div>
                                        </form>
                                    </div> {/*end of card-body*/}
                                </div> {/*end of card*/}
                            </div>
                        </div> {/*end of row*/}
                    </div> {/*end of container*/}
                </div> {/*end of content-page*/}
            </div> {/*end of wrapper*/}
        {/* <form name="frm" onSubmit={submitBtn} encType="multipart/form-data">
        <h3>그룹 생성하기</h3>
            <label htmlFor="GRP_NAME">그룹명 : </label>
            <br />
            <input type="text" name="grpName" value={grpName} onChange={(e)=>setGrpName(e.target.value)} />
            <button type="button" onClick={checkExistingGroup}>중복 확인</button>
            <br />
            <label htmlFor="GRP_IMAGE">그룹 대표 이미지 : </label>
            <br />
            <input type="file" name="uploadFile" onChange={(e)=>setGrpImage(e.target.value)} accept='*' />
            <br />
            <label htmlFor="GRP_IMAGE">그룹 소개 : </label>
            <br />
            <textarea cols="80" rows="5" name="grpIntro" onChange={(e)=>setGrpIntro(e.target.value)} />
            <input type="submit" value="그룹 생성하기" />
        </form> */}
        </>
    )
}