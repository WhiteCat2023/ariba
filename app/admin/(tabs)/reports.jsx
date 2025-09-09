import { SafeAreaView, ScrollView, StatusBar, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { Heading } from '@/components/ui/heading'
import { getAllReports } from '@/api/controller/report.controller'
import ReportListItemCard from '@/components/cards/components/ReportListItemCard'
import { HStack } from '@/components/ui/hstack'
import { Skeleton, SkeletonText } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { VStack } from '@/components/ui/vstack'
import SearchBar from '@/components/inputs/searchbar/SearchBar'
import { Grid, GridItem } from '@/components/ui/grid'
import { useAuth } from '@/context/AuthContext'
import { format } from "date-fns"

const Reports = () => {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadReports();
    }, []);

    useEffect(() => {
        console.log(reports)
        if (searchQuery) {
            const filtered = reports.filter(report => 
                report.title?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredReports(filtered);
        } else {
            setFilteredReports(reports);
        }
    }, [searchQuery, reports]);

    const loadReports = async () => {
        setLoading(true);
        try {
            const result = await getAllReports();
            if (result.status === 200) {
                setReports(result.data);
                console.log(result)
            } else {
                console.error("Error:", result.message);
            }
        } catch (error) {
            console.error("Failed to load reports:", error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadReports();
        setRefreshing(false);
    }, []);

    const renderReportItem = ({ item }) => {
        const formattedDate = item.timestamp?.toDate
            ? format(item.timestamp.toDate(), "MMM d | h:mma")
            : "";

        return (
            <ReportListItemCard
                title={item.title}
                date={formattedDate}
            />
        );
    };

    const renderSkeleton = () => {
        return (
            <VStack className="gap-4 mt-6">
            {[...Array(5)].map((_, index) => (
                <Card key={index} className="p-4">
                <HStack className="items-center gap-3">
                    <Skeleton className="w-3 h-12 rounded-full" />
                    <VStack className="flex-1 gap-2">
                    <SkeletonText _lines={1} className="h-5 w-3/4" />
                    <SkeletonText _lines={1} className="h-4 w-1/2" />
                    </VStack>
                </HStack>
                </Card>
            ))}
            </VStack>
        );
    };
    const renderEmptyState = () => {
        if (loading) return null;
        
        return (
            <Card className="flex items-center justify-center mt-10 py-8">
                <Text className="text-gray-600 text-center">
                    {searchQuery ? 'No reports found for your search' : 'No reports available'}
                </Text>
            </Card>
        );
    };

    return (
                <Grid
                    _extra={{
                        className: "lg:grid-cols-12 grid-cols-1 p-4"
                    }}
                >
                    <GridItem
                        _extra={{
                            className: "lg:col-span-8"
                        }}
                    >
                        <Box>
                            <Heading size='5xl' className='mt-6 text-gray-800'>
                                Reports
                            </Heading>
                        </Box>
                    </GridItem>
                    
                    <GridItem
                        className='items-end flex mt-6 lg:mt-0'
                        _extra={{
                            className: "lg:col-span-4"
                        }}
                    >
                        <SearchBar
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder="Search reports..."
                            />
                    </GridItem>
                    
                    <GridItem
                        _extra={{
                            className: "lg:col-span-12"
                        }}
                    >
                        {loading ? (
                            renderSkeleton()
                        ) : (
                            <FlatList
                                data={filteredReports}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={{ 
                                    gap: 16, 
                                    marginVertical: 16,
                                    flexGrow: 1
                                }}
                                ListEmptyComponent={renderEmptyState}
                                renderItem={renderReportItem}
                                refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    />
                                }
                            />
                                )}
                    </GridItem>
                </Grid>
    )
}

export default Reports