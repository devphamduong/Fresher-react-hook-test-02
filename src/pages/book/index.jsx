import { useLocation } from 'react-router-dom';
import "react-image-gallery/styles/scss/image-gallery.scss";
import ImageGallery from "react-image-gallery";
import { Col, Image, Modal, Row } from 'antd';
import './Book.scss';
import { useRef, useState } from 'react';

function BookPage() {
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get('id');

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const refGallery = useRef();
    const refGalleryModal = useRef();

    const images = [
        {
            original: "https://picsum.photos/id/1018/1000/600/",
            thumbnail: "https://picsum.photos/id/1018/250/150/",
            originClass: "origin-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: "https://picsum.photos/id/1015/1000/600/",
            thumbnail: "https://picsum.photos/id/1015/250/150/",
            originClass: "origin-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: "https://picsum.photos/id/1019/1000/600/",
            thumbnail: "https://picsum.photos/id/1019/250/150/",
            originClass: "origin-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: "https://picsum.photos/id/1018/1000/600/",
            thumbnail: "https://picsum.photos/id/1018/250/150/",
            originClass: "origin-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: "https://picsum.photos/id/1015/1000/600/",
            thumbnail: "https://picsum.photos/id/1015/250/150/",
            originClass: "origin-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: "https://picsum.photos/id/1019/1000/600/",
            thumbnail: "https://picsum.photos/id/1019/250/150/",
            originClass: "origin-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: "https://picsum.photos/id/1018/1000/600/",
            thumbnail: "https://picsum.photos/id/1018/250/150/",
            originClass: "origin-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: "https://picsum.photos/id/1015/1000/600/",
            thumbnail: "https://picsum.photos/id/1015/250/150/",
            originClass: "origin-image",
            thumbnailClass: "thumbnail-image"
        },
        {
            original: "https://picsum.photos/id/1019/1000/600/",
            thumbnail: "https://picsum.photos/id/1019/250/150/",
            originClass: "origin-image",
            thumbnailClass: "thumbnail-image"
        },
    ];

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

    return (
        <>
            <Row style={{ padding: '0 40px' }} justify={'space-evenly'}>
                <Col span={10}>
                    <ImageGallery ref={refGallery} items={images} onClick={(event) => handlePreview(event)} slideOnThumbnailOver={true} showPlayButton={false} showFullscreenButton={false} showNav={false} />
                </Col>
                <Col span={13}>
                    <div style={{ marginBottom: 10 }}>
                        Author: <span style={{ fontWeight: '500' }}>DuongPC</span>
                    </div>
                    <div style={{ fontWeight: '500', fontSize: '1.25rem', marginBottom: 10 }}>How to fix</div>
                    <div style={{ marginBottom: 10 }}><span style={{ fontWeight: '500', fontSize: '1rem' }}>999</span> Sold</div>
                    <div style={{ padding: '15px 20px', backgroundColor: 'white', color: 'red', fontWeight: '500', fontSize: '1.875rem', marginBottom: 10 }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(777777)}</div>
                    <div style={{ marginBottom: 10 }}>
                        Transport <span style={{ fontWeight: '500', marginLeft: 30 }}>Free ship</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ marginRight: 40 }}>Quantity</span>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <button className='custom custom-button'>-</button>
                            <input type="text" value={1} className='custom custom-input' />
                            <button style={{ marginRight: 10 }} className='custom custom-button'>+</button>
                        </div>
                        <span>999 available</span>
                    </div>
                    <button style={{ marginRight: 10 }} className='button button-add'>Add To Cart</button>
                    <button className='button button-buy'>Buy Now</button>
                </Col>
            </Row>
            <Modal width={'50%'} centered open={isOpenModal} onCancel={handleCancel} footer={null}>
                <Row justify={'space-evenly'}>
                    <Col span={13}>
                        <ImageGallery ref={refGalleryModal} items={images} showThumbnails={false} showPlayButton={false} showFullscreenButton={false} onSlide={(index) => handleMoveSlide(index)} />
                    </Col>
                    <Col span={10}>
                        <div style={{ fontWeight: '500', fontSize: '1.25rem', marginBottom: 10 }}>How to fix</div>
                        {images?.map((item, index) => {
                            return (
                                <div className={activeIndex === index ? 'active' : ''}>
                                    <Image width={100} height={100} src={item.original} preview={false} onClick={() => refGalleryModal.current.slideToIndex(index)} />
                                </div>
                            );
                        })}
                    </Col>
                </Row>
            </Modal>
        </>
    );
}

export default BookPage;