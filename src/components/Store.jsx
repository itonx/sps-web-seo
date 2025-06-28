import { useEffect, useState } from "react";

// Helper function to format price
const formatPrice = (price) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(price);
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Optional smooth scrolling
  });
};

export default function Store() {
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({ items: [] });
  const [apiHost, setApiHost] = useState("");
  const [displayEmptyStore, setDisplayEmptyStore] = useState(false);
  const [displayErrorAPI, setDisplayErrorAPI] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      const origin = window.location.origin.includes("localhost")
        ? "http://localhost:3000"
        : "https://sps-panel-ssr.vercel.app";
      setApiHost(origin);
      try {
        setIsLoading(true);
        setDisplayEmptyStore(false);
        setDisplayErrorAPI(false);
        const res = await fetch(`${origin}/api/store`);
        // console.log(res);
        if (res.ok) {
          const data = await res.json();
          setData(data);
        } else {
          if (res.status === 404) {
            setDisplayEmptyStore(true);
          } else {
            setDisplayErrorAPI(true);
          }
        }
      } catch (error) {
        // console.error("Error fetching items");
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (isLoading)
    return (
      <div className="h-[50vh] flex flex-row items-center justify-center mt-[100px]">
        <div className="text-white flex flex-row items-center gap-4">
          <div class="animate-spin rounded-full h-10 w-10 border-4 border-dotted border-white-600 border-t-transparent"></div>
          <span className="text-xl font-semibold">Cargando artículos...</span>
        </div>
      </div>
    );

  function openImageModal(itemId) {
    const item = data.items.find((item) => item._id === itemId);

    if (item && item.images && item.images.length > 0) {
      setCurrentImages(item.images);
      setCurrentImageIndex(0);
      setIsModalOpen(true);
    }
  }

  function closeImageModal() {
    setIsModalOpen(false);
  }

  function previousImage() {
    const finalIndex = currentImageIndex - 1;
    if (finalIndex < 0) {
      setCurrentImageIndex(currentImages.length - 1);
    } else {
      setCurrentImageIndex(finalIndex);
    }
  }

  function nextImage() {
    const finalIndex = currentImageIndex + 1;

    if (finalIndex >= currentImages.length) {
      setCurrentImageIndex(0);
    } else {
      setCurrentImageIndex(finalIndex);
    }
  }

  async function changePage(page) {
    try {
      setIsLoading(true);
      setDisplayEmptyStore(false);
      setDisplayErrorAPI(false);
      const res = await fetch(`${apiHost}/api/store?page=${page}`);
      if (res.ok) {
        const data = await res.json();
        setData(data);
      } else {
        if (res.status === 404) {
          setDisplayEmptyStore(true);
        } else {
          setDisplayErrorAPI(true);
        }
      }
    } catch (error) {
      // console.error("Error fetching items");
    } finally {
      setIsLoading(false);
      scrollToTop();
    }
  }

  if (displayEmptyStore) {
    return (
      <div className="text-white bg-black h-[80vh]" id="tienda">
        <div className="bg-black pt-7 pb-40">
          <div className="mx-auto md:max-w-7xl px-2">
            <div className="flex flex-row gap-3 items-center justify-center mx-auto max-w-lg text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.37 2.37 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0M1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5M4 15h3v-5H4zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm3 0h-2v3h2z" />
              </svg>
              Tienda
            </div>

            <div className="flex flex-col mt-10 gap-2 text-center text-2xl">
              De momento no tenemos artículos en stock, vuelve en unos días o
              contáctanos en nuestras redes sociales.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (displayErrorAPI) {
    return (
      <div className="text-white bg-black h-[80vh]" id="tienda">
        <div className="bg-black pt-7 pb-40">
          <div className="mx-auto md:max-w-7xl px-2">
            <div className="flex flex-row gap-3 items-center justify-center mx-auto max-w-lg text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.37 2.37 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0M1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5M4 15h3v-5H4zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm3 0h-2v3h2z" />
              </svg>
              Tienda
            </div>

            <div className="flex flex-col mt-10 gap-2 text-center text-2xl">
              Oops, algo ocurrió al intentar obtener los artículos, vuelve a
              intentar en unos momentos.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white bg-black" id="tienda">
      <div className="bg-black pt-7 pb-40">
        <div className="mx-auto md:max-w-7xl px-2">
          <div className="flex flex-row gap-3 items-center justify-center mx-auto max-w-lg text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.37 2.37 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0M1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5M4 15h3v-5H4zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm3 0h-2v3h2z" />
            </svg>
            Tienda
          </div>

          <div className="flex flex-col mt-10 overflow-x-auto gap-2">
            {data.items.map((item) => (
              <div
                key={item._id}
                className="min-h-[290px] grid grid-cols-1 grid-rows-2 lg:grid-rows-1 lg:grid-cols-3 bg-gray-800 border-transparent rounded-xl px-4 py-7"
              >
                <div className="row-start-1 col-start-1 min-w-[200px] border-l-1 flex flex-col items-center justify-center rounded-l-xl border-l-gray-800 border-r-0">
                  {item.images && item.images.length > 0 ? (
                    <div className="flex flex-col items-center">
                      <div className="relative flex flex-col items-center">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          width={250}
                          className="object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => openImageModal(item._id)}
                        />
                        {item.images.length > 1 && (
                          <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                            +{item.images.length - 1}
                          </div>
                        )}
                        <span
                          className="block cursor-pointer text-center mt-2"
                          onClick={() => openImageModal(item._id)}
                        >
                          Ver imágenes
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-gray-400 text-sm">Sin imagen</span>
                    </div>
                  )}
                </div>
                <div className="lg:ml-5 row-start-2 col-start-1 lg:row-start-1 lg:col-start-2 lg:col-span-2 text-white border-r-1 rounded-r-xl border-r-gray-800 border-l-0">
                  <div className="flex flex-col gap-2">
                    <div className="min-h-20 flex items-center justify-center lg:justify-start">
                      <div className="align-middle font-bold text-2xl line-clamp-2 text-overflow-ellipsis overflow-hidden first-letter:uppercase">
                        {item.title}
                      </div>
                    </div>
                    <div className="text-3xl line-clamp-1 text-overflow-ellipsis overflow-hidden text-green-400 font-semibold">
                      {formatPrice(item.total)}
                    </div>
                    <div className="min-h-10 first-letter:uppercase">
                      {item.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {data.pages > 1 && (
            <div className="mt-8 flex items-center justify-center space-x-2">
              <button
                className="cursor-pointer px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={data.currentPage === 1}
                onClick={() => changePage(data.currentPage - 1)}
              >
                Anterior
              </button>

              {Array.from({ length: data.pages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`cursor-pointer px-4 py-2 rounded transition-colors ${
                      page === data.currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                    onClick={() => changePage(page)}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                className="cursor-pointer px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={data.currentPage === data.pages}
                onClick={() => changePage(data.currentPage + 1)}
              >
                Siguiente
              </button>
            </div>
          )}

          <div className="mt-4 text-center text-gray-400 text-sm">
            Mostrando {(data.currentPage - 1) * data.limit + 1} -{" "}
            {Math.min(data.currentPage * data.limit, data.total)} de{" "}
            {data.total} productos
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          id="imageModal"
          className="fixed flex left-0 top-0 m-0 min-h-screen min-w-screen bg-[#0000008c] z-50 items-center justify-center"
        >
          <div className="relative max-w-[90%] max-h-full p-4 bg-[#c0c0c0] rounded-2xl">
            <button
              onClick={closeImageModal}
              className="absolute font-semibold bg-black w-10 h-10 top-4 right-4 text-[#ffffffbe] text-2xl hover:text-[#fff] z-10 cursor-pointer rounded-full border-1 border-[#5c5c5c]"
            >
              ×
            </button>

            <div className="relative">
              <img
                id="modalImage"
                src={currentImages[currentImageIndex]}
                alt={`Imagen ${currentImageIndex + 1}`}
                className="max-w-[100%] sm:max-w-[500px] max-h-[80vh] object-contain"
              />

              <button
                id="prevBtn"
                onClick={previousImage}
                className="absolute font-semibold w-10 text-3xl cursor-pointer left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
              >
                ‹
              </button>
              <button
                id="nextBtn"
                onClick={nextImage}
                className="absolute font-semibold w-10 text-3xl cursor-pointer right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
              >
                <span className="-mb-[10px]">›</span>
              </button>
            </div>

            <div className="text-center mt-4 text-black">
              <span id="imageCounter">
                {`${currentImageIndex + 1} / ${currentImages.length}`}
              </span>
            </div>

            <div
              id="dotsContainer"
              className="flex justify-center mt-4 space-x-2"
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
