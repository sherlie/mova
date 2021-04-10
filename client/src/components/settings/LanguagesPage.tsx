import React from 'react';
import { useQuery } from '@apollo/client';

import { GET_LANGUAGES } from '../../queries';

export const LanguagesPage = () => {
	const { loading, error, data } = useQuery(GET_LANGUAGES);

	if (loading) return <p>Loading...</p>;
  	if (error) return <p>Error :(</p>;
}
