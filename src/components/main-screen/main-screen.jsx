import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../header/header';
import Footer from '../footer/footer';
import CurrentPage from '../current-page/current-page';
import Filters from '../filters/filters';
import Sort from '../sort/sort';
import Catalog from '../catalog/catalog';
import Popup from '../popup/popup';
import {getPopup} from '../../store/page/selectors';
import {setPopup} from '../../store/actions';
import {getNumberFromString} from '../../utils';
import {COUNT_ON_PAGE, Price, GuitarType, StringsCount, SortType, SortDirection} from '../../const';

const MainScreen = () => {
  const {guitarsInfo} = useSelector((state) => state.DATA);

  const [focusedInputMin, setFocusedInputMin] = useState(false);
  const [focusedInputMax, setFocusedInputMax] = useState(false);

  const [sort, setSort] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  const [currentGuitars, setCurrentGuitars] = useState(guitarsInfo);

  const [activePage, setActivePage] = useState(1);
  const [pagesCount, setPagesCount] = useState(Math.ceil(currentGuitars.length / COUNT_ON_PAGE));

  const [priceRange, setPriceRange] = useState({
    max: Price.MAX,
    min: Price.MIN,
  });

  const [guitarType, setGuitarType] = useState({
    electro: false,
    ukulele: false,
    acoustic: false,
  });

  const [stringsType, setStringsType] = useState({
    four: false,
    six: false,
    seven: false,
    twelve: false,
  });

  const [stringsCount, setStringsCount] = useState({
    four: true,
    six: true,
    seven: true,
    twelve: true,
  });

  useEffect(() => {
    const array = guitarsInfo.filter((guitar) => {
      let result = false;

      if (guitarType.electro && !result) {
        result = guitar.type === GuitarType.ELECTRO;
      }

      if (guitarType.ukulele && !result) {
        result = guitar.type === GuitarType.UKULELE;
      }

      if (guitarType.acoustic && !result) {
        result = guitar.type === GuitarType.ACOUSTIC;
      }

      if (result) {
        result = false;

        if (!stringsType.four && stringsCount.four && !result) {
          result = guitar.strings === StringsCount.FOUR;
        }

        if (!stringsType.six && stringsCount.six && !result) {
          result = guitar.strings === StringsCount.SIX;
        }

        if (!stringsType.seven && stringsCount.seven && !result) {
          result = guitar.strings === StringsCount.SEVEN;
        }

        if (!stringsType.twelve && stringsCount.twelve && !result) {
          result = guitar.strings === StringsCount.TWELVE;
        }

        if (!stringsCount.four && !stringsCount.six && !stringsCount.seven && !stringsCount.twelve) {
          result = true;
        }
      }

      if (!guitarType.acoustic && !guitarType.ukulele && !guitarType.electro) {
        result = true;
      }

      if (result) {
        result = (guitar.price >= priceRange.min && guitar.price <= priceRange.max);
      }

      return result;
    });

    if (sort === SortType.PRICE) {
      if (sortDirection === null || sortDirection === SortDirection.UP) {
        setCurrentGuitars(array.sort((a, b) => a.price - b.price));
        setSortDirection(SortDirection.UP);
      }

      if (sortDirection === SortDirection.DOWN) {
        setCurrentGuitars(array.sort((a, b) => b.price - a.price));
      }
    }

    if (sort === SortType.POPULAR) {
      if (sortDirection === null || sortDirection === SortDirection.UP) {
        setCurrentGuitars(array.sort((a, b) => a.rating - b.rating));
        setSortDirection(SortDirection.UP);
      }

      if (sortDirection === SortDirection.DOWN) {
        setCurrentGuitars(array.sort((a, b) => b.rating - a.rating));
      }
    }

    setPagesCount(Math.ceil(array.length / COUNT_ON_PAGE));
    setCurrentGuitars(array);
  }, [guitarType, sort, sortDirection, priceRange, stringsCount]);

  useEffect(() => {
    if (guitarType.ukulele && !guitarType.electro && !guitarType.acoustic) {
      setStringsType({
        four: false,
        six: true,
        seven: true,
        twelve: true,
      });
    }

    if (guitarType.acoustic && !guitarType.electro && !guitarType.ukulele) {
      setStringsType({
        four: true,
        six: false,
        seven: false,
        twelve: false,
      });
    }

    if (guitarType.electro && !guitarType.acoustic) {
      setStringsType({
        four: false,
        six: false,
        seven: false,
        twelve: true,
      });
    }

    if ((guitarType.electro && guitarType.acoustic) || (guitarType.acoustic && guitarType.ukulele)) {
      setStringsType({
        four: false,
        six: false,
        seven: false,
        twelve: false,
      });
    }

    if (!guitarType.electro && !guitarType.acoustic && !guitarType.ukulele) {
      setStringsType({
        four: true,
        six: true,
        seven: true,
        twelve: true,
      });

      setStringsCount({
        four: false,
        six: false,
        seven: false,
        twelve: false,
      });
    }
  }, [guitarType]);

  useEffect(() => {
    if (priceRange.min < Price.MIN && !focusedInputMin) {
      return setPriceRange({
        ...priceRange,
        min: Price.MIN,
      });
    }

    if (priceRange.min > Price.MAX && !focusedInputMin) {
      return setPriceRange({
        ...priceRange,
        min: Price.MAX,
      });
    }

    if (priceRange.min > priceRange.max && priceRange.max > Price.MIN && !focusedInputMin) {
      return setPriceRange({
        ...priceRange,
        max: priceRange.min,
      });
    }

    if (priceRange.max > Price.MAX && !focusedInputMax) {
      return setPriceRange({
        ...priceRange,
        max: Price.MAX,
      });
    }

    if (priceRange.max < priceRange.min && !focusedInputMin) {
      return setPriceRange({
        ...priceRange,
        max: priceRange.min,
      });
    }

    return setPriceRange({
      max: priceRange.max,
      min: priceRange.min,
    });
  }, [focusedInputMin, focusedInputMax]);


  const handleInputMinFocus = () => {
    setFocusedInputMin(true);
  };

  const handleInputMaxFocus = () => {
    setFocusedInputMax(true);
  };

  const handleInputMinBlur = () => {
    setFocusedInputMin(false);
  };

  const handleInputMaxBlur = () => {
    setFocusedInputMax(false);
  };


  const handleSortPriceClick = (evt) => {
    evt.preventDefault();

    setSort(SortType.PRICE);
  };

  const handleSortPopularClick = (evt) => {
    evt.preventDefault();

    setSort(SortType.POPULAR);
  };

  const handleSortAscendingClick = (evt) => {
    evt.preventDefault();

    if (sortDirection === SortDirection.UP) {
      return;
    }

    if (sort === null) {
      setSort(SortType.PRICE);
    }

    setSortDirection(SortDirection.UP);
    setCurrentGuitars(currentGuitars.reverse());
  };

  const handleSortDescendingClick = (evt) => {
    evt.preventDefault();

    if (sortDirection === SortDirection.DOWN) {
      return;
    }

    if (sort === null) {
      setSort(SortType.PRICE);
    }

    setSortDirection(SortDirection.DOWN);
    setCurrentGuitars(currentGuitars.reverse());
  };

  const handleMinPriceType = (evt) => {
    const number = getNumberFromString(evt.target.value);

    setPriceRange({
      ...priceRange,
      min: number,
    });
  };

  const handleMaxPriceType = (evt) => {
    const number = getNumberFromString(evt.target.value);

    setPriceRange({
      ...priceRange,
      max: number,
    });
  };

  const handleGuitarTypeChange = (evt) => {
    switch (evt.target.value) {
      case GuitarType.ELECTRO: {
        return setGuitarType({
          ...guitarType,
          electro: evt.target.checked,
        });
      }
      case GuitarType.ACOUSTIC: {
        return setGuitarType({
          ...guitarType,
          acoustic: evt.target.checked,
        });
      }
      case GuitarType.UKULELE: {
        return setGuitarType({
          ...guitarType,
          ukulele: evt.target.checked,
        });
      }
      default: {
        return ``;
      }
    }
  };

  const handleStringsCountClick = (evt) => {
    switch (parseInt(evt.target.value, 10)) {
      case StringsCount.FOUR: {
        return setStringsCount({
          ...stringsCount,
          four: evt.target.checked,
        });
      }
      case StringsCount.SIX: {
        return setStringsCount({
          ...stringsCount,
          six: evt.target.checked,
        });
      }
      case StringsCount.SEVEN: {
        return setStringsCount({
          ...stringsCount,
          seven: evt.target.checked,
        });
      }
      case StringsCount.TWELVE: {
        return setStringsCount({
          ...stringsCount,
          twelve: evt.target.checked,
        });
      }
      default: {
        return ``;
      }
    }
  };


  const handleNextPageClick = (evt) => {
    evt.preventDefault();

    setActivePage(activePage + 1);
  };

  const handlePrevPageClick = (evt) => {
    evt.preventDefault();

    setActivePage(activePage - 1);
  };

  const handleLinkPageClick = (evt) => {
    evt.preventDefault();
    setActivePage(parseInt(evt.target.id, 10));
  };

  const dispatch = useDispatch();
  const popupName = useSelector(getPopup);
  const isPopupShown = Boolean(popupName);
  const closePopup = useCallback(() => {
    dispatch(setPopup(null));
  }, [dispatch]);

  const isBasket = false;

  const guitars = currentGuitars.slice((activePage - 1) * COUNT_ON_PAGE, activePage * COUNT_ON_PAGE);

  return (
    <div className="page">
      <Header />

      <main className="main">
        <CurrentPage isBasket={isBasket} />

        <section className="catalog-section">
          <Filters
            priceRange={priceRange}
            onFocusMin={handleInputMinFocus}
            onBlurMin={handleInputMinBlur}
            onChangeMin={handleMinPriceType}
            onFocusMax={handleInputMaxFocus}
            onBlurMax={handleInputMaxBlur}
            onChangeMax={handleMaxPriceType}

            guitarType={guitarType}
            handleGuitarTypeChange={handleGuitarTypeChange}

            stringsType={stringsType}
            stringsCount={stringsCount}
            handleStringsCountClick={handleStringsCountClick}
          />

          <Sort
            sort={sort}
            handleSortPriceClick={handleSortPriceClick}
            handleSortPopularClick={handleSortPopularClick}

            sortDirection={sortDirection}
            handleSortAscendingClick={handleSortAscendingClick}
            handleSortDescendingClick={handleSortDescendingClick}
          />

          <Catalog
            guitars={guitars}
            currentGuitars={currentGuitars}

            pagesCount={pagesCount}
            activePage={activePage}
            handlePrevPageClick={handlePrevPageClick}
            handleLinkPageClick={handleLinkPageClick}
            handleNextPageClick={handleNextPageClick}
          />
        </section>
      </main>

      <Footer isBasket={isBasket}/>

      {isPopupShown && <Popup
        id={popupName}
        onClose={closePopup}
      />}
    </div>
  );
};

export default MainScreen;
