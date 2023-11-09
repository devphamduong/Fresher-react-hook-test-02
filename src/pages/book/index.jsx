import { useLocation } from 'react-router-dom';
import "react-image-gallery/styles/scss/image-gallery.scss";
import ImageGallery from "react-image-gallery";
import { Button, Col, Image, Modal, Row } from 'antd';
import './Book.scss';
import { useEffect, useRef, useState } from 'react';
import BookSkeleton from './BookSkeleton';
import { getBookDetail } from '../../services/api';
import { useDispatch } from 'react-redux';
import { addToCartAction } from '../../redux/order/orderSlice';

function BookPage() {
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get('id');
    const dispatch = useDispatch();

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [dataBook, setDataBook] = useState({});
    const [quantity, setQuantity] = useState(1);

    const refGallery = useRef();
    const refGalleryModal = useRef();

    const handlePreview = (event) => {
        setIsOpenModal(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
    };

    const handleCancel = () => {
        setIsOpenModal(false);
    };

    const handleMoveSlide = (index) => {
        setActiveIndex(index);
    };

    useEffect(() => {
        fetchBookDetail(id);
    }, [id]);

    const fetchBookDetail = async (id) => {
        let res = await getBookDetail(id);
        if (res && res.data) {
            let data = res.data;
            data.images = getImages(data);
            setTimeout(() => {
                setDataBook(data);
            }, 3000);
        }
    };

    const getImages = (data) => {
        let images = [];
        if (data.thumbnail) {
            images.push(
                {
                    original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${data.thumbnail}`,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${data.thumbnail}`,
                }
            );
        }
        if (data.slider && data.slider.length > 0) {
            data.slider.map(item => images.push(
                {
                    original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                }
            ));
        }
        return images;
    };

    const images = dataBook?.images ?? [];

    const handleChangeQuantity = (event, min, max, type) => {
        if (event && !isNaN(event.target.value) && +event.target.value <= max) {
            setQuantity(+event.target.value);
        }
        if (type === 'decrease' && quantity > min) {
            setQuantity(+quantity - 1);
        }
        if (type === 'increase' && quantity < max) {
            setQuantity(+quantity + 1);
        }
    };

    const handleAddToCart = (quantity, book) => {
        dispatch(addToCartAction({ quantity, _id: book._id, detail: book }));
    };

    return (
        <>
            {dataBook && dataBook._id ?
                <Row style={{ padding: '0 40px' }} justify={'space-evenly'}>
                    <Col span={10}>
                        <ImageGallery ref={refGallery} items={images} onClick={(event) => handlePreview(event)} slideOnThumbnailOver={true} showPlayButton={false} showFullscreenButton={false} showNav={false} />
                    </Col>
                    <Col span={13}>
                        <div style={{ marginBottom: 10 }}>
                            Author: <span style={{ fontWeight: '500' }}>{dataBook.author}</span>
                        </div>
                        <div style={{ fontWeight: '500', fontSize: '1.25rem', marginBottom: 10 }}>{dataBook.mainText}</div>
                        <div style={{ marginBottom: 10 }}><span style={{ fontWeight: '500', fontSize: '1rem' }}>{dataBook.sold}</span> Sold</div>
                        <div style={{ padding: '15px 20px', backgroundColor: 'white', color: 'red', fontWeight: '500', fontSize: '1.875rem', marginBottom: 10 }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataBook.price)}</div>
                        <div style={{ marginBottom: 10 }}>
                            Transport <span style={{ fontWeight: '500', marginLeft: 30 }}>Free ship</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                            <span style={{ marginRight: 40 }}>Quantity</span>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button className='custom custom-button' style={{ display: 'flex', justifyContent: 'center' }} onClick={() => handleChangeQuantity(null, 1, dataBook.quantity, 'decrease')}><span>-</span></Button>
                                <input type="text" value={quantity} onChange={(event) => handleChangeQuantity(event, 1, dataBook.quantity)} className='custom custom-input' min={1} max={dataBook.quantity} />
                                <Button style={{ marginRight: 10, display: 'flex', justifyContent: 'center' }} className='custom custom-button' onClick={() => handleChangeQuantity(null, 1, dataBook.quantity, 'increase')}><span>+</span></Button>
                            </div>
                            <span>{dataBook.quantity} available</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Button style={{ marginRight: 10, display: 'flex', alignItems: 'center' }} className='button button-add' onClick={() => handleAddToCart(quantity, dataBook)}>Add To Cart</Button>
                            <Button className='button button-buy' style={{ display: 'flex', alignItems: 'center' }}>Buy Now</Button>
                        </div>
                    </Col>
                </Row>
                :
                < BookSkeleton />
            }
            <Modal width={'70%'} centered open={isOpenModal} onCancel={handleCancel} footer={null}>
                <Row justify={'space-evenly'}>
                    <Col span={13}>
                        <ImageGallery ref={refGalleryModal} items={images} showThumbnails={false} showPlayButton={false} showFullscreenButton={false} onSlide={(index) => handleMoveSlide(index)} />
                    </Col>
                    <Col span={10}>
                        <div style={{ fontWeight: '500', fontSize: '1.25rem', marginBottom: 10 }}>{dataBook.mainText}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                            {images?.map((item, index) => {
                                return (
                                    <Image className={activeIndex === index ? 'active' : ''} width={120} height={120} src={item.original} preview={false} onClick={() => refGalleryModal.current.slideToIndex(index)} />
                                );
                            })}
                        </div>
                    </Col>
                </Row>
            </Modal>
        </>
    );
}

export default BookPage;