import React, { useContext, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { createCarousel, getACarousel, removeACarousel } from '../utils/api';

import { BsTrash } from 'react-icons/bs';
import { MdOutlineClose } from 'react-icons/md';
import { Context } from '../App';
import Loader from '../components/ui/Loader';

const SlidesPage = () => {
  const { setIsShowSnack, setSnackDetail } = useContext(Context);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [carousels, setCarousels] = useState([]);

  const [link, setLink] = useState('');
  const [notificationImage, setNotificationImage] = useState(null);
  const [prevNotificationImage, setPrevNotificationImage] = useState(null);

  const onNotificationImageChange = (event) => {
    setNotificationImage(event.target.files[0]);
    if (event.target.files && event.target.files[0]) {
      setPrevNotificationImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const editQuestion = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const details = new FormData();
      details.append('image', notificationImage);
      details.append('link', link);
      details.append('name', 'home');
      const { data } = await createCarousel(details);
      fectchACarousel();
      setIsModelOpen(false);
      setSnackDetail({ type: 'success', msg: data.message });
      setIsShowSnack(true);
      setIsLoading(false);
      setPrevNotificationImage(null);
      setNotificationImage(null);
      setLink('');
    } catch (err) {
      console.log(err);
      setPrevNotificationImage(null);
      setNotificationImage(null);
      setIsLoading(false);
      if (err.response) {
        if (err.response.data) {
          setSnackDetail({ type: 'error', msg: err.response.data.message });
          setIsShowSnack(true);
        }
      }
      setIsModelOpen(false);
    }
  };

  const fectchACarousel = async () => {
    setIsLoading(true);
    try {
      const { data } = await getACarousel('home');

      setCarousels(data.carousel?.reverse());
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const deleteACarousel = async (id) => {
    setIsLoading(true);
    try {
      const res = await removeACarousel(id);
      fectchACarousel();
      setSnackDetail({ type: 'success', msg: res.data?.message });
      setIsShowSnack(true);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      if (err.response) {
        if (err.response.data) {
          setSnackDetail({ type: 'error', msg: err.response.data.message });
          setIsShowSnack(true);
        }
      }
    }
  };

  useEffect(() => {
    fectchACarousel();
  }, []);

  return (
    <div className="py-5">
      <div className="max-w-[1440px] mx-auto container px-5 flex justify-end">
        <button
          className="my-3 px-5 py-1.5 bg-blue-600 text-white rounded-sm"
          onClick={() => setIsModelOpen(true)}
        >
          Add Notification
        </button>
      </div>
      {carousels.length > 0 && (
        <>
          <Swiper
            centeredSlides={true}
            modules={[Autoplay, Pagination, Navigation]}
            autoplay={{
              delay: 10000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            style={{
              '--swiper-pagination-color': '#FFBA08',
              '--swiper-pagination-bullet-inactive-color': '#d4d4d4',
              '--swiper-pagination-bullet-inactive-opacity': '1',
              '--swiper-pagination-bullet-size': '10px',
              '--swiper-pagination-bullet-horizontal-gap': '6px',
            }}
            className="mySwipper max-w-[1440px] container mx-auto w-full"
          >
            {carousels.map((slide, i) => (
              <SwiperSlide key={i}>
                <img
                  src={slide.image_url}
                  alt="demo"
                  className="h-96 md:h-[600px] w-full object-contain"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="max-w-[1440px] container mx-auto px-5">
            <h3 className="text-lg font-semibold py-3">All Notifications</h3>
            <div className="w-full grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
              {carousels.map((slide, i) => (
                <div key={i} className="border relative">
                  <img
                    src={slide.image_url}
                    alt="demo"
                    className="h-96 w-full object-contain"
                  />
                  <p className="text-xl font-bold text-red-600 px-2 pt-2">
                    URL
                  </p>
                  <p className="p-2">{slide.link?.String}</p>
                  <button
                    type="button"
                    className="absolute top-5 right-5 text-red-500 rounded-full bg-gray-100 p-2 duration-150 hover:text-red-600 hover:bg-gray-200 hover:shadow-md"
                    onClick={() => deleteACarousel(slide.id)}
                  >
                    <BsTrash size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {isModelOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <form
            onSubmit={editQuestion}
            className="relative bg-white w-1/2 p-10 rounded shadow-md"
          >
            <div
              onClick={() => {
                setPrevNotificationImage(null);
                setNotificationImage(null);
                setIsModelOpen(false);
              }}
              className="absolute right-2 top-2 rounded-full p-1 hover:bg-gray-200 hover:shadow-md duration-150 hover:cursor-pointer"
            >
              <MdOutlineClose size={30} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm md:text-sm">Nofication Image</label>
              <input
                required
                type="file"
                accept="image/*"
                onChange={onNotificationImageChange}
                className="text-sm px-4 py-2 border border-black rounded-sm outline-black focus:border-none focus:outline focus:outline-blue-500"
              />
              {prevNotificationImage && (
                <img
                  alt="preview prevImage"
                  src={prevNotificationImage}
                  className="h-32 object-contain"
                />
              )}
              <label className="text-sm md:text-sm mt-3">Link</label>
              <input
                required
                type="text"
                onChange={(e) => setLink(e.target.value)}
                placeholder="Ex. https://youtube.com"
                className="text-sm px-4 py-2 border border-black rounded-sm outline-black focus:border-none focus:outline focus:outline-blue-500"
              />

              <button
                type="submit"
                className="mt-2 bg-blue-500 text-white rounded-sm py-3 px-2"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
      {isLoading && <Loader />}
    </div>
  );
};

export default SlidesPage;
