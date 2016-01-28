<?php
  /**
   * Batches for loop by date
   * @see http://erickmerchant.com/posts/a-date-batch-filter-for-twig/
   * @param  [type] $items  results
   * @param  [type] $prop   property to batch on
   * @param  string $format Date format of property
   * @return array         Returned items
   */

  function date_batch($items, $prop, $format = 'Y-m') {

    $result = [];



    foreach ($items as $item) {

      if (is_array($item)) {
        $date = $item[$prop];
      } elseif (is_object($item)) {
        $date = $item->{$prop};
      } else {
        continue;
      }

      if ($date instanceof \DateTime) {
        $key = \DateTime::createFromFormat($format, $date->format($format))->format('Y');
        var_dump( $key );
        $result[$key][] = $item;
      } else {
        $date = date_create_from_format( $format, $date );
        $key = $date->format( 'Y' );
        $result[$key][] = $item;
      }
    }

    return $result;
  };
