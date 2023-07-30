import '../css/Review.css';
import { Link } from 'react-router-dom';
import { serverTimestamp } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { auth,dbService, collection, addDoc} from '../fbase';
import { firebase}  from 'firebase/compat/app';
//import { firebase } from 'firebase/app'; // 이 줄을 추가하여 firebase를 'firebase/app'에서 import합니다.
import 'firebase/auth';
import 'firebase/firestore';
import logo2 from '../image/logo2.png';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function Review() {
  const [userEmail, setUserEmail] = useState('');
  const [reviewText, setReviewText] = useState('');

  // 리뷰를 저장할 Firestore 컬렉션에 대한 참조
  const reviewsCollection = collection(dbService, 'reviews');


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail('');
      }
    });

    // Clean up
    return () => unsubscribe();
  }, []);

  const fetchReviews = async () => {
    try {
      const snapshot = await reviewsCollection.get();
      const fetchedReviews = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
        timestamp: doc.data().timestamp,
        // Firestore에서 필요한 추가 속성이 있다면 더 추가할 수 있습니다.
      }));
    } catch (error) {
      console.error('리뷰를 불러오는데 오류 발생: ', error);
    }
  };

  const handleReviewChange = (e) => {
    setReviewText(e.target.value);

    // Display the content in the browser's console
    console.log(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (reviewText.trim() !== '') {
      try {
        setUserEmail(auth.currentUser.email);
        // 새로운 리뷰를 Firebase Firestore에 저장합니다.
        await addDoc(reviewsCollection, {
          text: reviewText,
          timestamp: serverTimestamp(), // Use serverTimestamp to get the current server time
          email: userEmail, // 작성자의 이메일을 추가하여 함께 저장
          // Firestore에 필요한 추가 속성이 있다면 더 추가할 수 있습니다.
        });

        // Firebase Firestore에서 업데이트된 리뷰를 다시 불러옵니다.
        fetchReviews();
        setReviewText('');
      } catch (error) {
        console.error('리뷰를 추가하는데 오류 발생: ', error);
      }
    }
  };

  return (
    <div class="reviews-background">
      <div class="heads">
        <div class="reviews-back">
          <button type="button" class="backbutton">
            <Link to="/Home" style={{ textDecoration: "none", color: "black" }}>Back</Link>
          </button>
        </div>
        <img class='headslogo' height={80} src={logo2} ></img>
        <h1 class="firsth1">
          후기 게시판
        </h1>
        <button type="button" class="myposts">
        <Link to="/Myposts" style={{ textDecoration: "none", color: "black" }}>나의 게시물</Link>
        </button>
      </div>
 
      <div class='reviews-bigbox'>
        <div class='middlebox'>
          <img class='pic' height={80} src={logo2} style={{marginRight:"px"}}></img>
          <div class='smallbox'>
            <form onSubmit={handleSubmit}> 
              <textarea
                className='review-textarea'
                value={reviewText}
                onChange={handleReviewChange}
                placeholder="게시물을 작성해주세요."
              ></textarea>
              <button type="submit" class='registerown'>
                등록
              </button>
            </form>
          </div>
        </div>

        <div class='middlebox'>
          <img class='pic' height={80} src={logo2} style={{marginRight:"px"}}></img>
          <div class='smallbox'>
            후기
          </div>
        </div>
        <div class='middlebox'>
          <img class='pic' height={80} src={logo2} style={{marginRight:"px"}}></img>
          <div class='smallbox'>
            후기
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;