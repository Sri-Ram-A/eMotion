def get_rankings(drivers_data:dict):
    # Calculate max values for normalization
    max_rating = max((driver.get('rating', 0) for driver in drivers_data)) or 1
    max_rides = max((driver.get('total_rides', 0) for driver in drivers_data)) or 1
    max_earnings = max((driver.get('earnings', 0) for driver in drivers_data)) or 1
    # Calculate score for each driver
    ranked_drivers = []
    for driver in drivers_data:
        normalized_rating = (driver.get('rating', 0) or 0) / max_rating
        normalized_rides = (driver.get('total_rides', 0) or 0) / max_rides
        normalized_earnings = (driver.get('earnings', 0) or 0) / max_earnings
        score = (
            0.5 * normalized_rating +
            0.3 * normalized_rides +
            0.2 * normalized_earnings
        )
        ranked_driver = driver.copy()
        ranked_driver['score'] = round(score, 4)  # Round to 4 decimal places
        ranked_drivers.append(ranked_driver)
    # Sort drivers by score in descending order
    ranked_drivers.sort(key=lambda x: x['score'], reverse=True)
    # Add rank position to each driver
    for index, driver in enumerate(ranked_drivers, start=1):
        driver['id'] = index #replacing id with rank dear
    return ranked_drivers