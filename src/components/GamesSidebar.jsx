import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  setCategories, 
  setTags, 
  setYear, 
  setMinRating, 
  clearFilters 
} from "../store/slices/filtersSlice";
import { fetchGames, setCurrentPage } from "../store/slices/gamesSlice";
import { Form, Button, Accordion, Badge, Row, Col } from "react-bootstrap";

const GamesSidebar = () => {
  const dispatch = useDispatch();
  const filters = useSelector(state => state.filters);
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [popularityRating, setPopularityRating] = useState(50);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  const categories = [
    { id: 4, name: "Action" },
    { id: 3, name: "Adventure" },
    { id: 5, name: "RPG" },
    { id: 10, name: "Strategy" },
    { id: 14, name: "Simulation" },
    { id: 15, name: "Sports" },
    { id: 1, name: "Racing" },
    { id: 7, name: "Puzzle" },
    { id: 19, name: "Horror" },
    { id: 59, name: "MMORPG" },
  ];

  const tags = [
    { id: 31, name: "Open World" },
    { id: 7, name: "Multiplayer" },
    { id: 31, name: "Single Player" },
    { id: 18, name: "Co-op" },
    { id: 8, name: "First Person" },
    { id: 5, name: "Third Person" },
    { id: 24, name: "Fantasy" },
    { id: 17, name: "Sci-Fi" },
    { id: 51, name: "Indie" },
    { id: 49, name: "Retro" },
  ];

  const releaseYears = [
    { id: 1, name: "2025" },
    { id: 2, name: "2024" },
    { id: 3, name: "2023" },
    { id: 4, name: "2022" },
    { id: 5, name: "2021" },
    { id: 6, name: "2020" },
    { id: 7, name: "2015-2019" },
    { id: 8, name: "2010-2014" },
    { id: 9, name: "2000-2009" },
    { id: 10, name: "Before 2000" },
  ];

  const categoriesToShow = showAllCategories
    ? categories
    : categories.slice(0, 5);
  const tagsToShow = showAllTags ? tags : tags.slice(0, 5);

  const handleCategoryChange = (e, categoryId) => {
    if (e.target.checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    }
  };

  const handleTagClick = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleYearChange = (e, year) => {
    if (e.target.checked) {
      setSelectedYear(year);
    } else {
      setSelectedYear('');
    }
  };

  const handleApplyFilters = () => {
    dispatch(setCategories(selectedCategories));
    dispatch(setTags(selectedTags));
    dispatch(setYear(selectedYear));
    dispatch(setMinRating(popularityRating));
    dispatch(setCurrentPage(1));
    dispatch(fetchGames({ page: 1 }));
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setSelectedYear('');
    setPopularityRating(0);
    dispatch(clearFilters());
    dispatch(setCurrentPage(1));
    dispatch(fetchGames({ page: 1 }));
  };

  return (
    <div className="bg-light p-2 rounded border">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0 fw-bold">Filters</h6>
        <Button
          variant="link"
          size="sm"
          className="text-decoration-none p-0 small"
          onClick={handleClearFilters}
        >
          Clear All
        </Button>
      </div>

      <Form.Group className="mb-3">
        <Form.Control type="text" placeholder="Search games..." size="sm" />
      </Form.Group>

      <Accordion defaultActiveKey={["0"]} flush className="border-top small">
        <Accordion.Item eventKey="0">
          <Accordion.Header className="py-1 small">Categories</Accordion.Header>
          <Accordion.Body className="py-1 px-1">
            <Row className="g-1">
              {categoriesToShow.map((category) => (
                <Col xs={6} key={category.id}>
                  <Form.Check
                    type="checkbox"
                    id={`category-${category.id}`}
                    label={category.name}
                    className="mb-1 small"
                    checked={selectedCategories.includes(category.id)}
                    onChange={(e) => handleCategoryChange(e, category.id)}
                  />
                </Col>
              ))}
            </Row>
            {categories.length > 5 && (
              <Button
                variant="link"
                size="sm"
                className="p-0 text-decoration-none small"
                onClick={() => setShowAllCategories(!showAllCategories)}
              >
                {showAllCategories ? "Show less" : "Show more"}
              </Button>
            )}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header className="py-1 small">Tags</Accordion.Header>
          <Accordion.Body className="py-1 px-1">
            <div className="d-flex flex-wrap gap-1">
              {tagsToShow.map((tag) => (
                <Badge
                  key={`${tag.id}_${Math.random()}`}
                  bg={selectedTags.includes(tag.id) ? "primary" : "light"}
                  text={selectedTags.includes(tag.id) ? "white" : "dark"}
                  className="border py-1 px-2 small cursor-pointer"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleTagClick(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
            {tags.length > 5 && (
              <Button
                variant="link"
                size="sm"
                className="p-0 text-decoration-none small mt-1"
                onClick={() => setShowAllTags(!showAllTags)}
              >
                {showAllTags ? "Show less" : "Show more"}
              </Button>
            )}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header className="py-1 small">
            Release Year
          </Accordion.Header>
          <Accordion.Body className="py-1 px-1">
            <Row className="g-1">
              {releaseYears.slice(0, 6).map((year) => (
                <Col xs={6} key={year.id}>
                  <Form.Check
                    type="radio"
                    name="releaseYear"
                    id={`year-${year.id}`}
                    label={year.name}
                    className="mb-1 small"
                    checked={selectedYear === year.name}
                    onChange={(e) => handleYearChange(e, year.name)}
                  />
                </Col>
              ))}
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      
      <div className="mb-3">
        <Form.Label className="d-flex justify-content-between small mb-1">
          <span>Popularity: {popularityRating}%</span>
        </Form.Label>
        <Form.Range
          min="0"
          max="100"
          value={popularityRating}
          onChange={(e) => setPopularityRating(parseInt(e.target.value))}
        />
      </div>
      
      <Button
        variant="primary"
        size="sm"
        className="w-100 mb-2"
        onClick={handleApplyFilters}
      >
        Apply Filters
      </Button>
    </div>
  );
};

export default GamesSidebar;